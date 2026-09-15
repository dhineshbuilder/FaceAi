'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Users, 
  MapPin, 
  Cpu, 
  Building2, 
  CheckCircle2, 
  Lock, 
  Sparkles, 
  RefreshCw
} from 'lucide-react';
import { fetchSubscriptionStatus } from '@/lib/api';

export default function DashboardPage() {
  const [subData, setSubData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadStatus = async () => {
    setLoading(true);
    const data = await fetchSubscriptionStatus(1);
    setSubData(data);
    setLoading(false);
  };

  useEffect(() => {
    loadStatus();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-500 text-sm">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span>Verifying Subscription with Database...</span>
        </div>
      </div>
    );
  }

  const features = subData?.features || {};
  const isEnterprise = subData?.plan_id === 'enterprise_monthly';
  const isPro = subData?.plan_id === 'pro_monthly';

  return (
    <div className="py-12 px-6 max-w-7xl mx-auto bg-slate-50 min-h-screen">
      {/* Dashboard Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold text-slate-900">FaceAI Master Control Deck</h1>
            <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Node
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">SBS Technologies • Centralized Biometric Infrastructure</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadStatus}
            className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-2 shadow-sm transition"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            Refresh
          </button>
          <Link
            href="/#pricing"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-blue-600/15"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Change Plan
          </Link>
        </div>
      </div>

      {/* Subscription Status Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
        <div className="bg-blue-600 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-100 uppercase tracking-wider">Active Plan</span>
            <span className="px-2.5 py-0.5 rounded-md bg-white text-[10px] font-black uppercase text-blue-700 shadow-sm">
              {subData?.plan_name || 'Free'}
            </span>
          </div>
          <div className="mt-4">
            <h2 className="text-2xl font-black">{subData?.plan_name} Tier</h2>
            <p className="text-xs text-blue-100 mt-1">Direct billing active via Razorpay</p>
          </div>
          <div className="mt-4 pt-4 border-t border-blue-500 flex items-center justify-between text-xs text-blue-100">
            <span>Status: <strong className="text-white">ACTIVE</strong></span>
            <span>Expires in: <strong className="text-white">30 Days</strong></span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Employee Quota</span>
          <div className="mt-4">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-slate-900">
                {isEnterprise ? 'Unlimited' : (isPro ? '182 / 500' : '38 / 50')}
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {isEnterprise ? '100% capacity' : `${isPro ? '36%' : '76%'} utilized`}
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-500"
                style={{ width: isEnterprise ? '100%' : (isPro ? '36%' : '76%') }}
              />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-600">
            Allowed Cap: <strong className="text-slate-900">{features.max_employees === -1 ? 'Unlimited' : `${features.max_employees} Profiles`}</strong>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Today's Recognition</span>
          <div className="mt-4">
            <h2 className="text-2xl font-black text-emerald-600">94.2% On-Time</h2>
            <p className="text-xs text-slate-600 mt-1">842 Present • 12 Late • 0 Buddy Punching</p>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-600">
            Neural Match Accuracy: <strong className="text-slate-900">99.9%</strong>
          </div>
        </div>
      </div>

      {/* Feature Entitlements Guard */}
      <div className="mt-12">
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <span>🛡️</span> Biometric Feature Entitlements
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Module 1: 3D Anti-Spoofing */}
          <div className={`p-6 rounded-3xl border transition ${
            features.has_liveness 
              ? 'bg-white border-emerald-300 shadow-sm ring-1 ring-emerald-400/20' 
              : 'border-slate-200 bg-slate-100/70 opacity-60'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              {features.has_liveness ? (
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                  Unlocked
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full bg-slate-200 text-slate-600 text-[10px] font-bold uppercase flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Pro / Enterprise
                </span>
              )}
            </div>
            <h3 className="font-bold text-slate-900 text-base">3D Liveness & Anti-Spoofing</h3>
            <p className="text-xs text-slate-600 mt-2">
              Analyzes micro-textures and facial depth to block printed photo and screen fraud.
            </p>
          </div>

          {/* Module 2: Multi-Face Recognition */}
          <div className={`p-6 rounded-3xl border transition ${
            features.has_multi_face 
              ? 'bg-white border-blue-300 shadow-sm ring-1 ring-blue-400/20' 
              : 'border-slate-200 bg-slate-100/70 opacity-60'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              {features.has_multi_face ? (
                <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold uppercase">
                  Unlocked
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full bg-slate-200 text-slate-600 text-[10px] font-bold uppercase flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Pro / Enterprise
                </span>
              )}
            </div>
            <h3 className="font-bold text-slate-900 text-base">Multi-Face Sync (10 in 1 frame)</h3>
            <p className="text-xs text-slate-600 mt-2">
              Simultaneous multi-person recognition for high volume warehouse & turnstile entry.
            </p>
          </div>

          {/* Module 3: Smart Geofencing */}
          <div className={`p-6 rounded-3xl border transition ${
            features.has_geofencing 
              ? 'bg-white border-indigo-300 shadow-sm ring-1 ring-indigo-400/20' 
              : 'border-slate-200 bg-slate-100/70 opacity-60'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              {features.has_geofencing ? (
                <span className="px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-bold uppercase">
                  Unlocked
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full bg-slate-200 text-slate-600 text-[10px] font-bold uppercase flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Pro / Enterprise
                </span>
              )}
            </div>
            <h3 className="font-bold text-slate-900 text-base">Smart GPS Geofencing</h3>
            <p className="text-xs text-slate-600 mt-2">
              GPS radius bounding box ensures field workers check in only at verified work coordinates.
            </p>
          </div>

          {/* Module 4: ERP / SAP Integration */}
          <div className={`p-6 rounded-3xl border transition ${
            features.has_erp_integration 
              ? 'bg-white border-purple-300 shadow-sm ring-1 ring-purple-400/20' 
              : 'border-slate-200 bg-slate-100/70 opacity-60'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              {features.has_erp_integration ? (
                <span className="px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold uppercase">
                  Unlocked
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full bg-slate-200 text-slate-600 text-[10px] font-bold uppercase flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Enterprise Only
                </span>
              )}
            </div>
            <h3 className="font-bold text-slate-900 text-base">SAP / Oracle ERP Sync</h3>
            <p className="text-xs text-slate-600 mt-2">
              Automated sync between FaceAI logs and enterprise ERP payroll ledgers.
            </p>
          </div>

          {/* Module 5: Multi-Site Operations */}
          <div className={`p-6 rounded-3xl border transition ${
            features.has_multi_site 
              ? 'bg-white border-amber-300 shadow-sm ring-1 ring-amber-400/20' 
              : 'border-slate-200 bg-slate-100/70 opacity-60'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Cpu className="w-5 h-5" />
              </div>
              {features.has_multi_site ? (
                <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold uppercase">
                  Unlocked
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full bg-slate-200 text-slate-600 text-[10px] font-bold uppercase flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Enterprise Only
                </span>
              )}
            </div>
            <h3 className="font-bold text-slate-900 text-base">Multi-Site Mesh Operations</h3>
            <p className="text-xs text-slate-600 mt-2">
              Centralized telemetry and terminal management across worldwide branch offices.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
