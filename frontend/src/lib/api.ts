/**
 * API Service for FaceAI Payment Operations
 * Communicates with PHP Backend (http://localhost:8000 or company server)
 * With automatic fallback to Next.js API routes for standalone laptop execution
 */

const PHP_BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function createPaymentOrder(planId: string, currency: 'INR' | 'USD', userId: number = 1) {
  // First try Next.js native API route or PHP
  try {
    const res = await fetch('/api/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan_id: planId, currency, user_id: userId })
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Next.js API fallback, trying PHP direct...');
  }

  // Fallback to PHP direct
  const res = await fetch(`${PHP_BACKEND_URL}/create-order.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ plan_id: planId, currency, user_id: userId })
  });
  return await res.json();
}

export async function verifyClientPayment(paymentData: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  internal_order_id: string;
}) {
  try {
    const res = await fetch('/api/verify-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData)
    });
    if (res.ok) return await res.json();
  } catch (e) {}

  const res = await fetch(`${PHP_BACKEND_URL}/verify-payment.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(paymentData)
  });
  return await res.json();
}

export async function fetchSubscriptionStatus(userId: number = 1) {
  try {
    const res = await fetch(`/api/check-access?user_id=${userId}`);
    if (res.ok) return await res.json();
  } catch (e) {}

  try {
    const res = await fetch(`${PHP_BACKEND_URL}/check-access.php?user_id=${userId}`);
    return await res.json();
  } catch (e) {
    return {
      has_active_subscription: false,
      plan_id: 'none',
      plan_name: 'Unsubscribed',
      features: { max_employees: 0, has_multi_face: false, has_liveness: false, has_geofencing: false, has_erp_integration: false, has_multi_site: false }
    };
  }
}
