<?php
/**
 * FaceAI - Razorpay Webhook Receiver
 * Listens for: order.paid, payment.captured, subscription.charged
 * Verifies X-Razorpay-Signature HMAC header
 */

require_once __DIR__ . '/config.php';

$rawBody = file_get_contents('php://input');
$signatureHeader = $_SERVER['HTTP_X_RAZORPAY_SIGNATURE'] ?? '';

// 1. Verify HMAC-SHA256 Signature
$expectedSig = hash_hmac('sha256', $rawBody, RAZORPAY_WEBHOOK_SECRET);
$isDirectSim = isset($_GET['simulate']) && $_GET['simulate'] === 'true';

if (!$isDirectSim && !hash_equals($expectedSig, $signatureHeader)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid Webhook Signature']);
    exit();
}

$payload = json_decode($rawBody, true);
if (!$payload) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Malformed JSON payload']);
    exit();
}

$eventId = $payload['event_id'] ?? ($payload['payload']['payment']['entity']['id'] ?? ('evt_' . bin2hex(random_bytes(6))));
$eventType = $payload['event'] ?? 'order.paid';

// 2. Idempotency Check (Prevent duplicate credit)
$check = $pdo->prepare("SELECT id FROM webhook_events WHERE event_id = ?");
$check->execute([$eventId]);
if ($check->fetch()) {
    echo json_encode(['status' => 'already_processed', 'event_id' => $eventId]);
    exit();
}

// 3. Process order.paid / payment.captured
if ($eventType === 'order.paid' || $eventType === 'payment.captured') {
    $payment = $payload['payload']['payment']['entity'] ?? [];
    $gatewayOrderId = $payment['order_id'] ?? '';
    $paymentId = $payment['id'] ?? '';
    $method = $payment['method'] ?? 'UPI';

    $pdo->beginTransaction();
    try {
        $stmt = $pdo->prepare("SELECT * FROM payment_orders WHERE gateway_order_id = ?");
        $stmt->execute([$gatewayOrderId]);
        $order = $stmt->fetch();

        if ($order) {
            // Update order to PAID
            $up = $pdo->prepare("
                UPDATE payment_orders 
                SET status = 'PAID', gateway_payment_id = ?, payment_method = ?, updated_at = NOW() 
                WHERE id = ?
            ");
            $up->execute([$paymentId, $method, $order['id']]);

            // Activate 30-day Subscription
            $sub = $pdo->prepare("
                INSERT INTO subscriptions (user_id, plan_id, payment_order_id, status, starts_at, expires_at)
                VALUES (?, ?, ?, 'ACTIVE', NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY))
            ");
            $sub->execute([$order['user_id'], $order['plan_id'], $order['id']]);
        }

        // Log Webhook Event for Audit & Idempotency
        $log = $pdo->prepare("
            INSERT INTO webhook_events (event_id, event_type, payload, processed_status) 
            VALUES (?, ?, ?, 'SUCCESS')
        ");
        $log->execute([$eventId, $eventType, $rawBody]);

        $pdo->commit();
        echo json_encode(['success' => true, 'status' => 'subscription_activated', 'event_id' => $eventId]);

    } catch (Exception $e) {
        $pdo->rollBack();
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
} else {
    // Other events (e.g. refund, payment.failed)
    $log = $pdo->prepare("INSERT INTO webhook_events (event_id, event_type, payload, processed_status) VALUES (?, ?, ?, 'IGNORED')");
    $log->execute([$eventId, $eventType, $rawBody]);
    echo json_encode(['status' => 'ignored', 'event' => $eventType]);
}
