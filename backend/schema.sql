-- ==========================================================
-- FaceAI Database Migration Schema (MySQL 8.0+)
-- Company: SBS Technologies
-- Platform: FaceAI Subscription & Razorpay Payment System
-- ==========================================================

CREATE DATABASE IF NOT EXISTS faceai_billing CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE faceai_billing;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(30) NULL,
    company_name VARCHAR(255) NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Subscription Plans Table
CREATE TABLE IF NOT EXISTS plans (
    id VARCHAR(50) PRIMARY KEY, -- e.g. 'starter_monthly', 'pro_monthly', 'enterprise_monthly'
    name VARCHAR(100) NOT NULL,
    price_inr DECIMAL(10, 2) NOT NULL,
    price_usd DECIMAL(10, 2) NOT NULL,
    billing_period ENUM('monthly', 'yearly') DEFAULT 'monthly',
    max_employees INT NOT NULL, -- 50, 500, -1 (unlimited)
    has_multi_face BOOLEAN DEFAULT FALSE,
    has_liveness BOOLEAN DEFAULT FALSE,
    has_geofencing BOOLEAN DEFAULT FALSE,
    has_erp_integration BOOLEAN DEFAULT FALSE,
    has_multi_site BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Seed FaceAI Plans
INSERT INTO plans (id, name, price_inr, price_usd, billing_period, max_employees, has_multi_face, has_liveness, has_geofencing, has_erp_integration, has_multi_site)
VALUES 
('starter_monthly', 'Starter', 1.00, 1.00, 'monthly', 50, FALSE, FALSE, FALSE, FALSE, FALSE),
('pro_monthly', 'Professional', 5.00, 5.00, 'monthly', 500, TRUE, TRUE, TRUE, FALSE, FALSE),
('enterprise_monthly', 'Enterprise', 10.00, 10.00, 'monthly', -1, TRUE, TRUE, TRUE, TRUE, TRUE)
ON DUPLICATE KEY UPDATE 
    name = VALUES(name),
    price_inr = VALUES(price_inr),
    price_usd = VALUES(price_usd),
    max_employees = VALUES(max_employees),
    has_multi_face = VALUES(has_multi_face),
    has_liveness = VALUES(has_liveness),
    has_geofencing = VALUES(has_geofencing),
    has_erp_integration = VALUES(has_erp_integration),
    has_multi_site = VALUES(has_multi_site);

-- 3. Payment Orders Table
CREATE TABLE IF NOT EXISTS payment_orders (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(100) UNIQUE NOT NULL,       -- Internal UUID: ORD_XXXXXXXXXXXX
    gateway_order_id VARCHAR(100) UNIQUE NULL,   -- Razorpay Order ID: order_NZxxxx
    user_id BIGINT UNSIGNED NOT NULL,
    plan_id VARCHAR(50) NOT NULL,
    currency VARCHAR(10) NOT NULL,               -- 'INR' or 'USD'
    amount DECIMAL(10, 2) NOT NULL,
    status ENUM('PENDING', 'PAID', 'FAILED', 'EXPIRED') DEFAULT 'PENDING',
    payment_method VARCHAR(50) NULL,             -- 'upi', 'card', 'netbanking'
    gateway_payment_id VARCHAR(100) NULL,        -- Razorpay Payment ID: pay_NZxxxx
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (plan_id) REFERENCES plans(id)
) ENGINE=InnoDB;

-- 4. Active Subscriptions Table
CREATE TABLE IF NOT EXISTS subscriptions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    plan_id VARCHAR(50) NOT NULL,
    payment_order_id BIGINT UNSIGNED NOT NULL,
    status ENUM('ACTIVE', 'GRACE_PERIOD', 'EXPIRED', 'CANCELLED') DEFAULT 'ACTIVE',
    starts_at TIMESTAMP NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    auto_renew BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (plan_id) REFERENCES plans(id),
    FOREIGN KEY (payment_order_id) REFERENCES payment_orders(id)
) ENGINE=InnoDB;

-- 5. Webhook Events Table (Idempotency & Replay Defense)
CREATE TABLE IF NOT EXISTS webhook_events (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    event_id VARCHAR(150) UNIQUE NOT NULL,       -- Gateway Event ID
    event_type VARCHAR(100) NOT NULL,
    payload JSON NOT NULL,
    processed_status ENUM('SUCCESS', 'FAILED', 'IGNORED') DEFAULT 'SUCCESS',
    received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Seed Default Test User (Demo Purposes)
INSERT INTO users (id, name, email, phone, company_name, password_hash)
VALUES (1, 'Babu Subramanian', 'admin@sbstechnologies.in', '+918144065688', 'SBS Technologies', '$2y$10$e8w6q8Q4X9hVwGqZ1xZgRe6V6YmO7aA9eKq8F3Q8X7Z7W7V7V7V7')
ON DUPLICATE KEY UPDATE name=VALUES(name);
