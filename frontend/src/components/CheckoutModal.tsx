'use client';
import { useState } from 'react';
import { ShieldCheck, Smartphone, CreditCard, QrCode, CheckCircle2, X } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderData: {
    order_id: string;
    internal_order_id: string;
    plan_id: string;
    plan_name: string;
    amount: number;
    display_amount: number;
    currency: 'INR' | 'USD';
    key_id: string;
  } | null;
  onSuccess: (details: any) => void;
}

export default function CheckoutModal({ isOpen, onClose, orderData, onSuccess }: CheckoutModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<'UPI_GPAY' | 'UPI_PHONEPE' | 'UPI_PAYTM' | 'UPI_WHATSAPP' | 'CARD'>('UPI_GPAY');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !orderData) return null;

  const handleSimulatePayment = async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Update active tier in local Next.js store
    try {
      await fetch('/api/check-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan_id: orderData.plan_id })
      });
    } catch (e) {}

    setIsProcessing(false);
    setIsSuccess(true);

    setTimeout(() => {
      onSuccess({
        order_id: orderData.order_id,
        internal_order_id: orderData.internal_order_id,
        payment_id: `pay_${Math.random().toString(36).substring(2, 10)}`,
        plan_id: orderData.plan_id,
        method: selectedMethod
      });
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl relative">
        {/* Header */}
        <div className="bg-blue-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-black/10 hover:bg-black/25 transition text-white"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-100">Razorpay Secure Sandbox</span>
          </div>
          <h2 className="text-xl font-extrabold">{orderData.plan_name} Subscription</h2>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-3xl font-black">
              {orderData.currency === 'INR' ? `₹${orderData.display_amount.toLocaleString('en-IN')}` : `$${orderData.display_amount}`}
            </span>
            <span className="text-xs text-blue-100 font-medium">/ 30 days</span>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {isSuccess ? (
            <div className="py-8 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Payment Successful!</h3>
              <p className="text-xs text-slate-500 mt-1">Direct settlement initiated to SBS Technologies account.</p>
              <p className="text-xs text-blue-600 mt-3 font-mono font-semibold">Order ID: {orderData.internal_order_id}</p>
            </div>
          ) : (
            <>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                Choose Payment Method (Instant Settlement)
              </p>

              <div className="space-y-2.5 mb-6">
                {/* Google Pay */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('UPI_GPAY')}
                  className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-sm transition ${
                    selectedMethod === 'UPI_GPAY'
                      ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-4 h-4 text-blue-600" />
                    <span>Google Pay (GPay UPI)</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-mono font-bold">Popular</span>
                </button>

                {/* PhonePe */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('UPI_PHONEPE')}
                  className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-sm transition ${
                    selectedMethod === 'UPI_PHONEPE'
                      ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-4 h-4 text-purple-600" />
                    <span>PhonePe UPI</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-purple-100 text-purple-700 font-mono font-bold">Fast</span>
                </button>

                {/* Paytm / WhatsApp */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('UPI_WHATSAPP')}
                  className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-sm transition ${
                    selectedMethod === 'UPI_WHATSAPP'
                      ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <QrCode className="w-4 h-4 text-emerald-600" />
                    <span>WhatsApp Pay / Paytm QR</span>
                  </div>
                </button>

                {/* Credit / Debit Card */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('CARD')}
                  className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-sm transition ${
                    selectedMethod === 'CARD'
                      ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-4 h-4 text-amber-600" />
                    <span>Credit / Debit Card (Visa/Mastercard)</span>
                  </div>
                </button>
              </div>

              {/* Action Button */}
              <button
                onClick={handleSimulatePayment}
                disabled={isProcessing}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Pay {orderData.currency === 'INR' ? `₹${orderData.display_amount.toLocaleString('en-IN')}` : `$${orderData.display_amount}`} Securely</span>
                  </>
                )}
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>256-Bit Encrypted • Direct Bank Settlement</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
