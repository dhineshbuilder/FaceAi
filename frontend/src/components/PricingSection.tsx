'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Sparkles, Shield, Zap, Building, ChevronRight } from 'lucide-react';
import { createPaymentOrder } from '@/lib/api';
import CheckoutModal from '@/components/CheckoutModal';

interface Plan {
  id: string;
  name: string;
  inr: number;
  usd: number;
  description: string;
  badge?: string;
  recommended?: boolean;
  features: string[];
  cta: string;
}

const PLANS: Plan[] = [
  {
    id: 'starter_monthly',
    name: 'Starter',
    inr: 9471,
    usd: 99,
    description: 'Perfect for small teams and startups with basic attendance needs.',
    features: [
      'Up to 50 Employees',
      'Face Recognition (99.9% match)',
      'Basic Attendance Reports',
      'Email Support (24h response)',
      'Single Site Access'
    ],
    cta: 'Get Started'
  },
  {
    id: 'pro_monthly',
    name: 'Professional',
    inr: 28605,
    usd: 299,
    description: 'For growing businesses that need advanced biometric features & anti-fraud.',
    badge: 'RECOMMENDED',
    recommended: true,
    features: [
      'Up to 500 Employees',
      'Multi-Face Recognition (10 in 1 frame)',
      '3D Anti-Spoofing & Liveness Detection',
      'Smart Geofencing (GPS locked zones)',
      'Edge Processing (<100ms response)',
      'Priority 24/7 Support'
    ],
    cta: 'Sign Up Now'
  },
  {
    id: 'enterprise_monthly',
    name: 'Enterprise',
    inr: 76440,
    usd: 799,
    description: 'Scalable solutions for large enterprises, multi-branch firms & retail chains.',
    features: [
      'Unlimited Employees',
      'Multi-Site Management Dashboard',
      'ERP / HRMS Integration (SAP, Oracle)',
      'Unified REST API & Webhooks',
      'Dedicated Technical Account Manager',
      'Custom SLA & Priority Support'
    ],
    cta: 'Contact Sales'
  }
];

export default function PricingSection() {
  const router = useRouter();
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [checkoutData, setCheckoutData] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectPlan = async (plan: Plan) => {
    setLoadingPlan(plan.id);
    try {
      const order = await createPaymentOrder(plan.id, currency);
      setCheckoutData(order);
      setIsModalOpen(true);
    } catch (err) {
      console.error(err);
      alert('Failed to initialize order. Please check backend connection.');
    } finally {
      setLoadingPlan(null);
    }
  };

  const handlePaymentSuccess = (details: any) => {
    setIsModalOpen(false);
    router.push(`/dashboard?payment=success&tier=${details.plan_id}`);
  };

  return (
    <section id="pricing" className="py-24 px-6 max-w-7xl mx-auto relative">
      <CheckoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        orderData={checkoutData}
        onSuccess={handlePaymentSuccess}
      />

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold tracking-wide uppercase mb-4">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          Pricing Plans
        </div>
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
          Investment For Your <span className="text-blue-600">Success</span>
        </h2>
        <p className="text-slate-600 mt-4 text-base md:text-lg">
          Flexible plans designed to scale with your business growth.
        </p>

        {/* Currency Switcher Toggle */}
        <div className="inline-flex items-center gap-4 mt-8 p-1.5 rounded-2xl bg-white border border-slate-300 shadow-sm">
          <button
            onClick={() => setCurrency('USD')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition ${
              currency === 'USD' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            USD ($)
          </button>
          <button
            onClick={() => setCurrency('INR')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition ${
              currency === 'INR' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            INR (₹)
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {PLANS.map((plan) => {
          const displayPrice = currency === 'INR' ? `₹${plan.inr.toLocaleString('en-IN')}` : `$${plan.usd}`;
          const isPro = plan.recommended;

          return (
            <div
              key={plan.id}
              className={`rounded-3xl p-8 flex flex-col justify-between relative transition-all duration-300 ${
                isPro
                  ? 'bg-blue-600 text-white shadow-2xl shadow-blue-500/25 md:-translate-y-3 ring-4 ring-blue-600/20'
                  : 'bg-white text-slate-900 border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-300'
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-amber-400 text-slate-900 text-[11px] font-black uppercase tracking-wider shadow-md">
                  {plan.badge}
                </div>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <h3 className={`text-xl font-bold tracking-wide uppercase ${isPro ? 'text-white' : 'text-slate-900'}`}>
                    {plan.name}
                  </h3>
                  {plan.id === 'starter_monthly' && <Zap className="w-5 h-5 text-blue-500" />}
                  {plan.id === 'pro_monthly' && <Shield className="w-5 h-5 text-white" />}
                  {plan.id === 'enterprise_monthly' && <Building className="w-5 h-5 text-blue-500" />}
                </div>

                <p className={`text-xs mt-2 min-h-[32px] ${isPro ? 'text-blue-100' : 'text-slate-500'}`}>
                  {plan.description}
                </p>

                {/* Price Display */}
                <div className={`mt-6 mb-8 pb-6 border-b ${isPro ? 'border-blue-500' : 'border-slate-100'}`}>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-4xl md:text-5xl font-black tracking-tight ${isPro ? 'text-white' : 'text-slate-900'}`}>
                      {displayPrice}
                    </span>
                    <span className={`text-sm font-medium ${isPro ? 'text-blue-200' : 'text-slate-500'}`}>/mo</span>
                  </div>
                  <p className={`text-[11px] mt-1 ${isPro ? 'text-blue-200' : 'text-slate-400'}`}>Billed monthly • Cancel anytime</p>
                </div>

                {/* Features List */}
                <div className="space-y-3 mb-8">
                  <p className={`text-xs font-bold uppercase tracking-wider ${isPro ? 'text-blue-200' : 'text-slate-700'}`}>
                    What's Included:
                  </p>
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-xs">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        isPro ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-600'
                      }`}>
                        <Check className="w-2.5 h-2.5" />
                      </div>
                      <span className={isPro ? 'text-white font-medium' : 'text-slate-600'}>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleSelectPlan(plan)}
                disabled={loadingPlan === plan.id}
                className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-md ${
                  isPro
                    ? 'bg-slate-950 text-white hover:bg-black hover:scale-[1.02]'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {loadingPlan === plan.id ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{plan.cta}</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
