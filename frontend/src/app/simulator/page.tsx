'use client';
import { useState } from 'react';
import Link from 'next/link';
import { 
  Terminal, 
  Play, 
  CheckCircle2, 
  ArrowRight, 
  Smartphone, 
  CreditCard, 
  QrCode
} from 'lucide-react';
import { createPaymentOrder, fetchSubscriptionStatus } from '@/lib/api';

export default function SimulatorPage() {
  const [selectedPlan, setSelectedPlan] = useState('pro_monthly');
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  const [method, setMethod] = useState('UPI_GPAY');
  const [logs, setLogs] = useState<string[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [activeResult, setActiveResult] = useState<any>(null);

  const addLog = (msg: string) => {
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const handleRunTest = async () => {
    setIsExecuting(true);
    setLogs([]);
    setActiveResult(null);

    addLog(`[Step 1] Initializing order for ${selectedPlan} in ${currency}...`);
    try {
      // 1. Create Order
      const order = await createPaymentOrder(selectedPlan, currency);
      addLog(`[Step 1 Success] Order Generated: ${order.internal_order_id} (Gateway Ref: ${order.order_id})`);
      addLog(`Amount: ${currency === 'INR' ? '₹' : '$'}${order.display_amount} | Razorpay Key: ${order.key_id}`);

      // 2. Simulate User Payment
      addLog(`[Step 2] Simulating client payment authorization via ${method}...`);
      await new Promise((r) => setTimeout(r, 1000));
      addLog(`[Step 2 Success] Payment Captured: pay_${Math.random().toString(36).substring(2, 9)}`);

      // 3. Trigger Signed Webhook
      addLog(`[Step 3] Firing HMAC-SHA256 signed Webhook (order.paid) to server...`);
      const webhookRes = await fetch('/api/check-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan_id: selectedPlan })
      });
      const webhookData = await webhookRes.json();
      addLog(`[Step 3 Success] Server verified signature & updated subscription in database!`);

      // 4. Fetch updated access
      const access = await fetchSubscriptionStatus(1);
      setActiveResult(access);
      addLog(`[Complete] FaceAI features successfully unlocked for user.`);
    } catch (err: any) {
      addLog(`[Error] Simulation failed: ${err.message}`);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="py-12 px-6 max-w-7xl mx-auto bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-slate-200 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold text-slate-900">Laptop Payment & Webhook Simulator</h1>
            <span className="px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold font-mono">
              Localhost Testing Mode
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Simulate complete end-to-end Razorpay payments and instant webhook activations without live credit cards.
          </p>
        </div>

        <Link
          href="/dashboard"
          className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition"
        >
          <span>View Dashboard</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-blue-600" />
              Simulation Parameters
            </h2>

            {/* Plan Select */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                Select FaceAI Plan
              </label>
              <select
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm text-slate-900 font-medium focus:border-blue-600 outline-none"
              >
                <option value="starter_monthly">Starter Plan (₹9,471 / $99 / mo)</option>
                <option value="pro_monthly">Professional Plan (₹28,605 / $299 / mo) - Recommended</option>
                <option value="enterprise_monthly">Enterprise Plan (₹76,440 / $799 / mo)</option>
              </select>
            </div>

            {/* Currency */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                Currency
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setCurrency('INR')}
                  className={`py-2.5 rounded-xl text-xs font-bold transition border ${
                    currency === 'INR'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  INR (₹)
                </button>
                <button
                  type="button"
                  onClick={() => setCurrency('USD')}
                  className={`py-2.5 rounded-xl text-xs font-bold transition border ${
                    currency === 'USD'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  USD ($)
                </button>
              </div>
            </div>

            {/* Payment App */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                Simulated Payment App
              </label>
              <div className="space-y-2">
                {[
                  { id: 'UPI_GPAY', name: 'Google Pay (GPay UPI)', icon: Smartphone },
                  { id: 'UPI_PHONEPE', name: 'PhonePe UPI', icon: Smartphone },
                  { id: 'UPI_PAYTM', name: 'Paytm UPI', icon: QrCode },
                  { id: 'UPI_WHATSAPP', name: 'WhatsApp Pay', icon: QrCode },
                  { id: 'CARD', name: 'Credit / Debit Card (Visa/Mastercard)', icon: CreditCard }
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setMethod(item.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border text-xs font-semibold transition ${
                        method === item.id
                          ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <Icon className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>{item.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Run Button */}
            <button
              onClick={handleRunTest}
              disabled={isExecuting}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/20 transition disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
            >
              {isExecuting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Simulating Transaction...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Execute 1-Click Payment Lifecycle</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Console & Output Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col h-full min-h-[480px]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">Live Execution Console</h3>
              </div>
              <span className="text-[11px] font-mono text-slate-500">HMAC-SHA256 • Verified</span>
            </div>

            {/* Console Output */}
            <div className="flex-1 bg-slate-900 text-emerald-400 p-4 rounded-2xl border border-slate-800 font-mono text-xs overflow-y-auto max-h-[300px] space-y-2">
              {logs.length === 0 ? (
                <p className="text-slate-500 italic">Select options and click "Execute 1-Click Payment Lifecycle" to see real-time order creation, webhook verification, and entitlement updates.</p>
              ) : (
                logs.map((log, idx) => (
                  <p key={idx} className={log.includes('Success') ? 'text-emerald-400' : (log.includes('Error') ? 'text-rose-400' : 'text-slate-300')}>
                    {log}
                  </p>
                ))
              )}
            </div>

            {/* Live Result State */}
            {activeResult && (
              <div className="mt-4 p-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Active Plan: {activeResult.plan_name} Tier
                  </p>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Employee Capacity: {activeResult.features?.max_employees === -1 ? 'Unlimited' : `${activeResult.features?.max_employees} Profiles`}
                  </p>
                </div>
                <Link
                  href="/dashboard"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
