<?php
/**
 * FaceAI - Feature Access & Entitlements Guard
 * Returns active subscription tier and unlocked biometric capabilities
 */

require_once __DIR__ . '/config.php';

$userId = (int)($_GET['user_id'] ?? 1);

// Find latest ACTIVE subscription for user
$stmt = $pdo->prepare("
    SELECT s.*, p.name as plan_name, p.max_employees, p.has_multi_face, 
           p.has_liveness, p.has_geofencing, p.has_erp_integration, p.has_multi_site
    FROM subscriptions s
    JOIN plans p ON s.plan_id = p.id
    WHERE s.user_id = ? AND s.status = 'ACTIVE' AND s.expires_at > NOW()
    ORDER BY s.id DESC
    LIMIT 1
");
$stmt->execute([$userId]);
$sub = $stmt->fetch();

if ($sub) {
    echo json_encode([
        'has_active_subscription' => true,
        'subscription_id' => $sub['id'],
        'plan_id' => $sub['plan_id'],
        'plan_name' => $sub['plan_name'],
        'starts_at' => $sub['starts_at'],
        'expires_at' => $sub['expires_at'],
        'features' => [
            'max_employees' => (int)$sub['max_employees'],
            'has_multi_face' => (bool)$sub['has_multi_face'],
            'has_liveness' => (bool)$sub['has_liveness'],
            'has_geofencing' => (bool)$sub['has_geofencing'],
            'has_erp_integration' => (bool)$sub['has_erp_integration'],
            'has_multi_site' => (bool)$sub['has_multi_site']
        ]
    ]);
} else {
    echo json_encode([
        'has_active_subscription' => false,
        'plan_id' => 'none',
        'plan_name' => 'Free / Unsubscribed',
        'features' => [
            'max_employees' => 0,
            'has_multi_face' => false,
            'has_liveness' => false,
            'has_geofencing' => false,
            'has_erp_integration' => false,
            'has_multi_site' => false
        ]
    ]);
}
