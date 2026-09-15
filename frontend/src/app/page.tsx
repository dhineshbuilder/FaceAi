import Link from 'next/link';
import { 
  ShieldCheck, 
  Users, 
  MapPin, 
  Cpu, 
  WifiOff, 
  Code2, 
  Sparkles, 
  ChevronRight
} from 'lucide-react';
import PricingSection from '@/components/PricingSection';

export default function HomePage() {
  return (
    <div className="relative overflow-hidden bg-slate-50">
      {/* Background Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-blue-500/10 blur-[100px] pointer-events-none -z-10 rounded-full" />

      {/* 1. HERO SECTION */}
      <section className="pt-20 pb-16 px-6 max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-6">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          Next-Gen Biometrics Infrastructure
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-tight">
          The Future of Attendance <br className="hidden md:block" />
          <span className="text-blue-600">
            is Here with FaceAI
          </span>
        </h1>

        <p className="mt-6 text-base md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          FaceAI leverages cutting-edge neural networks to provide military-grade recognition, 
          permanently eliminating buddy punching and manual tracking forever.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#pricing"
            className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-blue-600/20 transition hover:scale-105 flex items-center justify-center gap-2"
          >
            <span>Explore Pricing & Subscribe</span>
            <ChevronRight className="w-4 h-4" />
          </a>
          <Link
            href="/simulator"
            className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm rounded-2xl border border-slate-300 shadow-sm transition flex items-center justify-center gap-2"
          >
            <span>Launch Test Simulator</span>
          </Link>
        </div>

        {/* 2. LIVE METRICS BAR */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-20 p-6 bg-white rounded-3xl border border-slate-200 shadow-sm text-left">
          <div className="p-3 border-r border-slate-100">
            <p className="text-2xl md:text-3xl font-black text-slate-900">99.9%</p>
            <p className="text-[11px] text-slate-500 font-semibold mt-1 uppercase tracking-wide">Match Accuracy</p>
          </div>
          <div className="p-3 border-r border-slate-100">
            <p className="text-2xl md:text-3xl font-black text-blue-600">10K+</p>
            <p className="text-[11px] text-slate-500 font-semibold mt-1 uppercase tracking-wide">Active Daily Users</p>
          </div>
          <div className="p-3 border-r border-slate-100">
            <p className="text-2xl md:text-3xl font-black text-indigo-600">500K+</p>
            <p className="text-[11px] text-slate-500 font-semibold mt-1 uppercase tracking-wide">Attendance Logs</p>
          </div>
          <div className="p-3 border-r border-slate-100">
            <p className="text-2xl md:text-3xl font-black text-emerald-600">100%</p>
            <p className="text-[11px] text-slate-500 font-semibold mt-1 uppercase tracking-wide">Uptime Reliability</p>
          </div>
          <div className="p-3 col-span-2 md:col-span-1">
            <p className="text-2xl md:text-3xl font-black text-amber-600">24/7</p>
            <p className="text-[11px] text-slate-500 font-semibold mt-1 uppercase tracking-wide">Expert Support</p>
          </div>
        </div>
      </section>

      {/* 3. CORE CAPABILITIES */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest">Core Capabilities</h2>
          <p className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-2">
            Everything You Need for Smart Attendance
          </p>
          <p className="text-slate-600 text-sm mt-3">
            Advanced edge-computing capabilities ensure your biometric data stays secure while delivering instantaneous results.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">3D Anti-Spoofing</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Military-grade liveness detection that prevents spoofing via printed photos, high-res screen replays, or 3D silicone masks.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Multi-Face Sync</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Simultaneously verify up to 10 employees in a single camera frame, perfectly tailored for high-traffic entry/exit gates.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Smart Geofencing</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Ensure field staff are physically at their designated construction sites or client offices with precise GPS-locked check-in zones.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Edge Processing</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Lightning-fast local inference means recognition happens in under 100ms, even with thousands of registered employee vectors.
            </p>
          </div>

          {/* Card 5 */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-6">
              <WifiOff className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Offline Support</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Never miss a check-in. Data is stored securely offline in encrypted cache and auto-syncs as soon as internet connectivity returns.
            </p>
          </div>

          {/* Card 6 */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-6">
              <Code2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Unified REST API</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Seamlessly connect FaceAI with your existing SAP, Oracle, Zoho People, or custom HRMS platforms with webhook events.
            </p>
          </div>
        </div>
      </section>

      {/* 4. PRICING SECTION */}
      <PricingSection />

      {/* 5. FAQ SECTION */}
      <section className="py-20 px-6 max-w-4xl mx-auto border-t border-slate-200">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-500 mt-2">Everything you need to know about our billing & biometric infrastructure.</p>
        </div>

        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900">Which payment methods are accepted?</h3>
            <p className="text-xs text-slate-600 mt-2">
              We support Google Pay, PhonePe, Paytm, WhatsApp Pay, all Indian & International Credit/Debit cards (Visa, Mastercard, RuPay), and Net Banking via Razorpay.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900">How does direct bank settlement work?</h3>
            <p className="text-xs text-slate-600 mt-2">
              All subscription payments are routed through RBI-licensed Razorpay infrastructure and automatically credited to your company bank account on T+1 settlement cycles.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900">How does FaceAI handle mask & PPE detection?</h3>
            <p className="text-xs text-slate-600 mt-2">
              Our neural network models are trained on occluded facial datasets, enabling 99.9% accurate recognition even when employees wear surgical masks, glasses, or construction helmets.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
