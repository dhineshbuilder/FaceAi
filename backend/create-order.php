<?php
/**
 * FaceAI - Order Creation API
 * Accepts: { "plan_id": "pro_monthly", "currency": "INR", "user_id": 1 }
 * Returns: { "order_id": "order_xxx", "amount": 2860500, "currency": "INR", "key_id": "rzp_test_xxx", ... }
 */

require_once __DIR__ . '/config.php';

$rawBody = file_get_contents('php://input');
$data = json_decode($rawBody, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid JSON request payload']);
    exit();
}

$planId = $data['plan_id'] ?? 'pro_monthly';
$currency = strtoupper($data['currency'] ?? 'INR');
$userId = (int)($data['user_id'] ?? 1);

// 1. Fetch Plan Details from MySQL
$stmt = $pdo->prepare("SELECT * FROM plans WHERE id = ? AND is_active = 1");
$stmt->execute([$planId]);
$plan = $stmt->fetch();

if (!$plan) {
    http_response_code(404);
    echo json_encode(['success' => false, 'error' => "Plan '$planId' not found"]);
    exit();
}

$amount = ($currency === 'USD') ? (float)$plan['price_usd'] : (float)$plan['price_inr'];
$amountSubunits = (int)round($amount * 100); // In Paise or Cents

// Generate unique internal Order Tracking ID
$internalOrderId = 'ORD_' . strtoupper(bin2hex(random_bytes(6)));

// 2. Call Razorpay API to generate Gateway Order
$gatewayOrderId = 'order_sim_' . bin2hex(random_bytes(7)); // fallback simulator ID

// If live/test Razorpay keys are configured, make real cURL call
if (strpos(RAZORPAY_KEY_ID, 'Example') === false) {
    $ch = curl_init('https://api.razorpay.com/v1/orders');
    curl_setopt($ch, CURLOPT_USERPWD, RAZORPAY_KEY_ID . ':' . RAZORPAY_KEY_SECRET);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
        'amount' => $amountSubunits,
        'currency' => $currency,
        'receipt' => $internalOrderId,
        'notes' => [
            'user_id' => (string)$userId,
            'plan_id' => $planId,
            'plan_name' => $plan['name']
        ]
    ]));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    $resData = json_decode($response, true);
    if ($httpCode === 200 && isset($resData['id'])) {
        $gatewayOrderId = $resData['id'];
    }
}

// 3. Save Order into MySQL payment_orders with PENDING status
$insertStmt = $pdo->prepare("
    INSERT INTO payment_orders (order_id, gateway_order_id, user_id, plan_id, currency, amount, status)
    VALUES (?, ?, ?, ?, ?, ?, 'PENDING')
");
$insertStmt->execute([$internalOrderId, $gatewayOrderId, $userId, $planId, $currency, $amount]);

echo json_encode([
    'success' => true,
    'order_id' => $gatewayOrderId,
    'internal_order_id' => $internalOrderId,
    'plan_id' => $planId,
    'plan_name' => $plan['name'],
    'amount' => $amountSubunits,
    'display_amount' => $amount,
    'currency' => $currency,
    'key_id' => RAZORPAY_KEY_ID,
    'company_name' => 'SBS Technologies - FaceAI'
]);
