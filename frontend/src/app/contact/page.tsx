import Link from 'next/link';
import { Mail, Phone, MapPin, Building, Clock, Shield } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="py-16 px-6 max-w-4xl mx-auto bg-slate-50 min-h-screen">
      <div className="bg-white p-8 md:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-8">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Connect With Us</span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Contact SBS Technologies</h1>
          <p className="text-xs text-slate-500 mt-2">
            Reach out to our technical success and enterprise solutions team for inquiries, integrations, or billing assistance.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Corporate Inquiries</h3>
            <p className="text-xs text-slate-600">Enterprise deployments & API integrations</p>
            <a href="mailto:hr@sbstechnologies.in" className="text-xs font-bold text-blue-600 hover:underline block pt-1">
              hr@sbstechnologies.in
            </a>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">24/7 Priority Support</h3>
            <p className="text-xs text-slate-600">Technical support & billing assistance</p>
            <a href="tel:+918144065688" className="text-xs font-bold text-emerald-600 hover:underline block pt-1">
              +91 81440 65688
            </a>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 md:col-span-2">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Registered Headquarters</h3>
            <p className="text-xs text-slate-600">
              SBS Technologies, Erode, Tamil Nadu, India — PIN: 638004
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200 flex justify-between items-center text-xs">
          <Link href="/" className="text-blue-600 font-bold hover:underline">← Back to Home</Link>
          <Link href="/terms" className="text-slate-600 hover:text-blue-600">Terms & Conditions →</Link>
        </div>
      </div>
    </div>
  );
}
