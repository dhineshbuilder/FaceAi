<?php
/**
 * 1-Click Database Installer & Migrator for FaceAI Billing
 * Run this in browser: http://localhost:8000/setup-db.php or via CLI
 */

$dbHost = getenv('DB_HOST') ?: '127.0.0.1';
$dbPort = getenv('DB_PORT') ?: '3306';
$dbUser = getenv('DB_USER') ?: 'root';
$dbPass = getenv('DB_PASS') ?: '';

header('Content-Type: application/json');

try {
    // 1. Connect without specific DB to create database
    $rootPdo = new PDO("mysql:host=$dbHost;port=$dbPort", $dbUser, $dbPass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
    
    $sqlFile = __DIR__ . '/schema.sql';
    if (!file_exists($sqlFile)) {
        throw new Exception("schema.sql not found at $sqlFile");
    }

    $sqlContent = file_get_contents($sqlFile);
    $rootPdo->exec($sqlContent);

    echo json_encode([
        'success' => true,
        'message' => 'faceai_billing database and all tables successfully created & seeded!',
        'tables' => ['users', 'plans', 'payment_orders', 'subscriptions', 'webhook_events']
    ], JSON_PRETTY_PRINT);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ], JSON_PRETTY_PRINT);
}
