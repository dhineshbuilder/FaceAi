# 🏛️ SBS Technologies — FaceAI Payment & Subscription Platform

An enterprise-grade, full-stack payment integration and tier-based access management platform for **FaceAI**, supporting **Google Pay, PhonePe, Paytm, WhatsApp Pay, Credit/Debit Cards, and NetBanking** with automated direct-to-bank settlement via **Razorpay**.

---

## 💻 Tech Stack

* **Frontend:** Next.js 14+ (App Router), React 18, TypeScript, TailwindCSS, Lucide Icons.
* **Backend:** PHP 8+ REST Endpoints (Ready to deploy on your company Apache/Nginx server).
* **Database:** MySQL 8.0+ (Complete schema, foreign keys, idempotency logs).
* **Payment Gateway:** Razorpay (UPI Intent, Cards, Auto-settlement to company bank account).

---

## 🚀 1. How to Run Manually on Your Laptop

### Step 1: Open Terminal in the `frontend` Directory
```bash
cd frontend
```

### Step 2: Install Dependencies (If not already installed)
```bash
npm install
```

### Step 3: Start the Next.js Development Server
```bash
npm run dev
```

### Step 4: Open in Your Browser
* 🌟 **Main Landing & Pricing Page:** [http://localhost:3000](http://localhost:3000)
* 🛡️ **Subscriber Control Deck:** [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
* 💳 **Laptop Test Simulator:** [http://localhost:3000/simulator](http://localhost:3000/simulator)

---

## 🐘 2. (Optional) Running PHP Backend Locally

If you have PHP installed and want to run the PHP backend locally:
```bash
cd backend
php -S localhost:8000
```

*(Note: The Next.js frontend is built with auto-fallback, so running `npm run dev` alone in `frontend` works 100% out-of-the-box!)*

---

## 🏢 3. Deploying on Your Company PHP & MySQL Server

### Step 1: Import MySQL Database Schema
Run the provided SQL file on your company MySQL server:
```bash
mysql -u your_user -p faceai_billing < backend/schema.sql
```
*(Or use PHPMyAdmin to import `backend/schema.sql`)*

### Step 2: Configure Credentials in `backend/.env`
Update `backend/.env` with your company database credentials and Razorpay keys:
```env
DB_HOST=127.0.0.1
DB_NAME=faceai_billing
DB_USER=your_company_db_user
DB_PASS=your_company_db_password

RAZORPAY_KEY_ID=rzp_test_TcL0OgMia0rIqA
RAZORPAY_KEY_SECRET=tZ1OepF48bQciaL3GF0eA7Qt
RAZORPAY_WEBHOOK_SECRET=whsec_FaceAISecretKey2026
```

### Step 3: Configure Razorpay Webhook
In your [Razorpay Dashboard](https://dashboard.razorpay.com/) $\rightarrow$ **Settings** $\rightarrow$ **Webhooks**:
* **Webhook URL:** `https://your-company-domain.com/backend/webhook.php`
* **Secret:** `whsec_FaceAISecretKey2026`
* **Active Events:** Check `order.paid` and `payment.captured`

---

## 💰 4. Subscription Pricing Tiers Configured

| Plan | Price (INR) | Price (USD) | Max Employees | Included Biometric Features |
| :--- | :--- | :--- | :--- | :--- |
| **Starter** | **₹9,471** / mo | **$99** / mo | Up to 50 | Face Recognition (99.9% accuracy), Basic Reports, Email Support |
| **Professional** *(Recommended)* | **₹28,605** / mo | **$299** / mo | Up to 500 | Multi-Face Recognition, 3D Liveness Detection, Smart Geofencing, Priority Support |
| **Enterprise** | **₹76,440** / mo | **$799** / mo | Unlimited | Multi-Site Mesh Ops, SAP/Oracle ERP Integration, Dedicated Manager |
