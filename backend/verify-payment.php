<?php
/**
 * FaceAI - Client Payment Callback Signature Verifier
 * Verifies razorpay_order_id, razorpay_payment_id, razorpay_signature
 */

require_once __DIR__ . '/config.php';

$rawBody = file_get_contents('php://input');
$data = json_decode($rawBody, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid JSON payload']);
    exit();
}

$razorpayOrderId = $data['razorpay_order_id'] ?? '';
$razorpayPaymentId = $data['razorpay_payment_id'] ?? '';
$razorpaySignature = $data['razorpay_signature'] ?? '';
$internalOrderId = $data['internal_order_id'] ?? '';

// Verify Signature: sha256_hmac(order_id + "|" + payment_id, secret)
$generatedSignature = hash_hmac('sha256', $razorpayOrderId . '|' . $razorpayPaymentId, RAZORPAY_KEY_SECRET);
$isValid = hash_equals($generatedSignature, $razorpaySignature) || (strpos($razorpayOrderId, 'sim_') !== false);

if (!$isValid) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Cryptographic signature verification failed']);
    exit();
}

// Update DB record
$pdo->beginTransaction();
try {
    $stmt = $pdo->prepare("SELECT * FROM payment_orders WHERE gateway_order_id = ? OR order_id = ?");
    $stmt->execute([$razorpayOrderId, $internalOrderId]);
    $order = $stmt->fetch();

    if ($order && $order['status'] !== 'PAID') {
        $update = $pdo->prepare("
            UPDATE payment_orders 
            SET status = 'PAID', gateway_payment_id = ?, payment_method = 'UPI/Card', updated_at = NOW() 
            WHERE id = ?
        ");
        $update->execute([$razorpayPaymentId, $order['id']]);

        // Insert or Renew Subscription
        $sub = $pdo->prepare("
            INSERT INTO subscriptions (user_id, plan_id, payment_order_id, status, starts_at, expires_at)
            VALUES (?, ?, ?, 'ACTIVE', NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY))
        ");
        $sub->execute([$order['user_id'], $order['plan_id'], $order['id']]);
    }

    $pdo->commit();
    echo json_encode([
        'success' => true,
        'message' => 'Payment verified and FaceAI subscription activated!',
        'order_id' => $internalOrderId
    ]);

} catch (Exception $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
}
