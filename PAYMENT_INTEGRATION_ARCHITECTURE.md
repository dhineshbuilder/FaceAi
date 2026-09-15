# 🏛️ FaceAI Payment Integration Blueprint (Razorpay + Company PHP & MySQL Server)

---

## 📌 1. Finalized Tech Stack & Infrastructure

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | **Next.js 14+ (React / TypeScript / TailwindCSS)** | Pricing UI, Dynamic Currency Switcher (`INR ₹` / `USD $`), Razorpay Standard Checkout SDK |
| **Backend** | **Company Dedicated PHP Server (Apache/Nginx + PHP 8.x)** | Order generation, HMAC-SHA256 signature verification, Webhook processing, Subscription engine |
| **Database** | **Company Dedicated MySQL 8.0+ Server** | Users, Plans, Orders, Subscriptions, Webhook logs |
| **Payment Gateway** | **Razorpay (Official Aggregator)** | Unified gateway for **Google Pay, PhonePe, Paytm, WhatsApp Pay, Credit/Debit Cards, NetBanking** $\rightarrow$ Direct auto-settlement to company bank account |

---

## 💰 2. FaceAI Subscription Pricing Tiers

| Tier | Price (INR) | Price (USD) | Employee Limit | Included Access |
| :--- | :--- | :--- | :--- | :--- |
| **Starter** | **₹9,471** / mo | **$99** / mo | Up to 50 | Face Recognition, Basic Reports, Email Support |
| **Professional** *(Recommended)* | **₹28,605** / mo | **$299** / mo | Up to 500 | Multi-Face Sync, 3D Liveness Detection, Smart Geofencing, Priority Support |
| **Enterprise** | **₹76,440** / mo | **$799** / mo | Unlimited | Multi-Site Management, ERP Integration (SAP/Oracle), Dedicated Account Manager |

---

## 🔄 3. How the Razorpay Payment & Access Flow Works

```
[Customer on Next.js UI]
        │
        ▼ 1. Clicks "Get Started" on Plan (e.g., Professional ₹28,605)
[Calls PHP: POST /api/create-order.php]
        │
        ▼ 2. PHP calls Razorpay API & saves Order as PENDING in MySQL
[Razorpay Checkout Modal Opens]
        │
        ▼ 3. Customer chooses app (GPay / PhonePe / Paytm / WhatsApp / Card) & Pays
[Razorpay Collects Payment] ──► Automatically settles to Company Bank Account (T+1 days)
        │
        ▼ 4. Razorpay sends signed Webhook to PHP (/api/webhook.php)
[PHP verifies HMAC-SHA256 signature]
        │
        ▼ 5. Updates MySQL: Status = 'PAID' & Activates 30-Day Subscription
[Next.js Dashboard Unlocks FaceAI Features for Customer]
```

---

## 🗄️ 4. MySQL Database Schema

Run this SQL script on your company MySQL server:

```sql
CREATE DATABASE IF NOT EXISTS faceai_billing CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE faceai_billing;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(30) NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Plans Definition Table
CREATE TABLE IF NOT EXISTS plans (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price_inr DECIMAL(10, 2) NOT NULL,
    price_usd DECIMAL(10, 2) NOT NULL,
    max_employees INT NOT NULL,
    has_liveness BOOLEAN DEFAULT FALSE,
    has_geofencing BOOLEAN DEFAULT FALSE,
    has_erp_integration BOOLEAN DEFAULT FALSE
);

INSERT INTO plans (id, name, price_inr, price_usd, max_employees, has_liveness, has_geofencing, has_erp_integration)
VALUES 
('starter_monthly', 'Starter', 9471.00, 99.00, 50, FALSE, FALSE, FALSE),
('pro_monthly', 'Professional', 28605.00, 299.00, 500, TRUE, TRUE, FALSE),
('enterprise_monthly', 'Enterprise', 76440.00, 799.00, -1, TRUE, TRUE, TRUE)
ON DUPLICATE KEY UPDATE price_inr=VALUES(price_inr), price_usd=VALUES(price_usd);

-- 3. Razorpay Orders Table
CREATE TABLE IF NOT EXISTS payment_orders (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(100) UNIQUE NOT NULL,       -- Internal UUID (ORD_XXXX)
    gateway_order_id VARCHAR(100) UNIQUE NULL,   -- Razorpay order ID (order_XXXXX)
    user_id BIGINT UNSIGNED NOT NULL,
    plan_id VARCHAR(50) NOT NULL,
    currency VARCHAR(10) NOT NULL,               -- 'INR' or 'USD'
    amount DECIMAL(10, 2) NOT NULL,
    status ENUM('PENDING', 'PAID', 'FAILED') DEFAULT 'PENDING',
    payment_method VARCHAR(50) NULL,             -- 'upi', 'card', 'netbanking'
    gateway_payment_id VARCHAR(100) NULL,        -- Razorpay payment ID (pay_XXXXX)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (plan_id) REFERENCES plans(id)
);

-- 4. Active Subscriptions Table (Controls Feature Access)
CREATE TABLE IF NOT EXISTS subscriptions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    plan_id VARCHAR(50) NOT NULL,
    payment_order_id BIGINT UNSIGNED NOT NULL,
    status ENUM('ACTIVE', 'EXPIRED') DEFAULT 'ACTIVE',
    starts_at TIMESTAMP NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (plan_id) REFERENCES plans(id),
    FOREIGN KEY (payment_order_id) REFERENCES payment_orders(id)
);

-- 5. Webhook Logs (Prevents Replay Attacks & Double Crediting)
CREATE TABLE IF NOT EXISTS webhook_events (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    event_id VARCHAR(150) UNIQUE NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    payload JSON NOT NULL,
    received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🐘 5. PHP Backend Scripts (For Company PHP Server)

### 1. `db.php`
```php
<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Razorpay-Signature');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$host = 'localhost';
$dbname = 'faceai_billing';
$username = 'YOUR_DB_USER';
$password = 'YOUR_DB_PASSWORD';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
    exit();
}

// Razorpay Merchant Credentials
define('RAZORPAY_KEY_ID', 'rzp_live_xxxxxxxxxxxx');
define('RAZORPAY_KEY_SECRET', 'YOUR_RAZORPAY_KEY_SECRET');
define('RAZORPAY_WEBHOOK_SECRET', 'YOUR_RAZORPAY_WEBHOOK_SECRET');
```

### 2. `create-order.php`
```php
<?php
require_once 'db.php';

$input = json_decode(file_get_contents('php://input'), true);
$planId = $input['plan_id'] ?? null;
$currency = $input['currency'] ?? 'INR';
$userId = $input['user_id'] ?? 1;

if (!$planId) {
    http_response_code(400);
    echo json_encode(['error' => 'plan_id is required']);
    exit();
}

// 1. Fetch Plan from Database
$stmt = $pdo->prepare("SELECT * FROM plans WHERE id = ?");
$stmt->execute([$planId]);
$plan = $stmt->fetch();

if (!$plan) {
    http_response_code(404);
    echo json_encode(['error' => 'Invalid plan']);
    exit();
}

$amount = ($currency === 'INR') ? (float)$plan['price_inr'] : (float)$plan['price_usd'];
$amountSubunits = (int)($amount * 100); // In Paise or Cents
$internalOrderId = 'ORD_' . strtoupper(bin2hex(random_bytes(6)));

// 2. Call Razorpay API to Create Gateway Order
$ch = curl_init('https://api.razorpay.com/v1/orders');
curl_setopt($ch, CURLOPT_USERPWD, RAZORPAY_KEY_ID . ':' . RAZORPAY_KEY_SECRET);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'amount' => $amountSubunits,
    'currency' => $currency,
    'receipt' => $internalOrderId,
    'notes' => ['user_id' => $userId, 'plan_id' => $planId]
]));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

$gatewayOrder = json_decode($response, true);

if ($httpCode !== 200 || !isset($gatewayOrder['id'])) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to initialize Razorpay order', 'details' => $gatewayOrder]);
    exit();
}

// 3. Save PENDING Order to MySQL
$insert = $pdo->prepare("INSERT INTO payment_orders (order_id, gateway_order_id, user_id, plan_id, currency, amount, status) VALUES (?, ?, ?, ?, ?, ?, 'PENDING')");
$insert->execute([$internalOrderId, $gatewayOrder['id'], $userId, $planId, $currency, $amount]);

echo json_encode([
    'order_id' => $gatewayOrder['id'],
    'internal_order_id' => $internalOrderId,
    'amount' => $amountSubunits,
    'currency' => $currency,
    'key_id' => RAZORPAY_KEY_ID
]);
```

### 3. `webhook.php`
```php
<?php
require_once 'db.php';

$rawPayload = file_get_contents('php://input');
$signature = $_SERVER['HTTP_X_RAZORPAY_SIGNATURE'] ?? '';

if (!$signature) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing signature']);
    exit();
}

// 1. Verify Razorpay HMAC-SHA256 Signature
$expectedSignature = hash_hmac('sha256', $rawPayload, RAZORPAY_WEBHOOK_SECRET);
if (!hash_equals($expectedSignature, $signature)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid signature']);
    exit();
}

$payload = json_decode($rawPayload, true);
$eventId = $payload['event_id'] ?? ($payload['payload']['payment']['entity']['id'] ?? null);

// 2. Idempotency Check
$check = $pdo->prepare("SELECT id FROM webhook_events WHERE event_id = ?");
$check->execute([$eventId]);
if ($check->fetch()) {
    echo json_encode(['status' => 'already_processed']);
    exit();
}

// 3. Process 'order.paid' Event
if (($payload['event'] ?? '') === 'order.paid') {
    $payment = $payload['payload']['payment']['entity'];
    $gatewayOrderId = $payment['order_id'];
    $paymentId = $payment['id'];
    $method = $payment['method'] ?? 'UPI';

    $pdo->beginTransaction();
    try {
        $stmt = $pdo->prepare("SELECT * FROM payment_orders WHERE gateway_order_id = ?");
        $stmt->execute([$gatewayOrderId]);
        $order = $stmt->fetch();

        if ($order) {
            // Update Order to PAID
            $updateOrder = $pdo->prepare("UPDATE payment_orders SET status = 'PAID', gateway_payment_id = ?, payment_method = ? WHERE id = ?");
            $updateOrder->execute([$paymentId, $method, $order['id']]);

            // Activate 30-Day Subscription
            $sub = $pdo->prepare("INSERT INTO subscriptions (user_id, plan_id, payment_order_id, status, starts_at, expires_at) VALUES (?, ?, ?, 'ACTIVE', NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY))");
            $sub->execute([$order['user_id'], $order['plan_id'], $order['id']]);
        }

        // Log Event
        $log = $pdo->prepare("INSERT INTO webhook_events (event_id, event_type, payload) VALUES (?, ?, ?)");
        $log->execute([$eventId, $payload['event'], $rawPayload]);

        $pdo->commit();
    } catch (Exception $e) {
        $pdo->rollBack();
        http_response_code(500);
        echo json_encode(['error' => 'Transaction error: ' . $e->getMessage()]);
        exit();
    }
}

echo json_encode(['status' => 'ok']);
```

---

## ⚛️ 6. Frontend Next.js 14+ Component

### `components/Pricing.tsx`
```tsx
'use client';
import { useState } from 'react';
import Script from 'next/script';

const PLANS = [
  { id: 'starter_monthly', name: 'Starter', inr: 9471, usd: 99, features: ['Up to 50 Employees', 'Face Recognition', 'Basic Reports', 'Email Support'] },
  { id: 'pro_monthly', name: 'Professional', inr: 28605, usd: 299, features: ['Up to 500 Employees', 'Multi-Face Sync', '3D Liveness Detection', 'Smart Geofencing', 'Priority Support'], recommended: true },
  { id: 'enterprise_monthly', name: 'Enterprise', inr: 76440, usd: 799, features: ['Unlimited Employees', 'Multi-Site Ops', 'ERP Integration', 'Dedicated Manager'] }
];

export default function Pricing() {
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (plan: any) => {
    setLoading(plan.id);
    try {
      const res = await fetch('https://your-company-domain.com/api/create-order.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan_id: plan.id, currency })
      });
      const data = await res.json();

      const options = {
        key: data.key_id,
        amount: data.amount,
        currency: data.currency,
        name: 'SBS Technologies - FaceAI',
        description: `${plan.name} Monthly Subscription`,
        order_id: data.order_id,
        handler: () => {
          window.location.href = `/dashboard?payment=success&order=${data.internal_order_id}`;
        },
        prefill: {
          name: 'Client Name',
          email: 'client@domain.com',
          contact: '+919876543210'
        },
        theme: { color: '#2563eb' }
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (e) {
      alert('Payment initialization failed.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <section className="py-12 max-w-6xl mx-auto px-4">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      
      {/* Currency Switcher */}
      <div className="flex justify-center items-center gap-4 mb-8">
        <span className={currency === 'USD' ? 'font-bold text-blue-600' : 'text-gray-500'}>USD ($)</span>
        <button onClick={() => setCurrency(currency === 'INR' ? 'USD' : 'INR')} className="w-12 h-6 bg-gray-300 rounded-full p-1 cursor-pointer">
          <div className={`w-4 h-4 bg-blue-600 rounded-full transition ${currency === 'INR' ? 'translate-x-6' : ''}`} />
        </button>
        <span className={currency === 'INR' ? 'font-bold text-blue-600' : 'text-gray-500'}>INR (₹)</span>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {PLANS.map((p) => (
          <div key={p.id} className={`p-6 rounded-2xl border ${p.recommended ? 'border-blue-500 bg-blue-50/50 shadow-xl' : 'border-gray-200 bg-white'}`}>
            <h3 className="font-bold text-lg">{p.name}</h3>
            <p className="text-3xl font-extrabold my-4">{currency === 'INR' ? `₹${p.inr.toLocaleString('en-IN')}` : `$${p.usd}`}<span className="text-sm font-normal">/mo</span></p>
            <ul className="space-y-2 mb-6 text-sm">{p.features.map((f, i) => <li key={i}>✓ {f}</li>)}</ul>
            <button onClick={() => handleCheckout(p)} disabled={loading === p.id} className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
              {loading === p.id ? 'Connecting...' : 'Get Started'}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
```

---

## 🔒 7. Razorpay Direct Settlement Checklist
1. **Merchant KYC:** Completed on [razorpay.com](https://razorpay.com).
2. **Bank Account Linked:** Verified current bank account for auto-settlement.
3. **Webhook Registered:** In Razorpay Dashboard $\rightarrow$ Settings $\rightarrow$ Webhooks $\rightarrow$ URL: `https://your-domain.com/api/webhook.php`, Event: `order.paid`.
4. **Go Live:** Replace `rzp_test_...` with `rzp_live_...` credentials.
