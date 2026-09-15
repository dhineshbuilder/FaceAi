import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="py-16 px-6 max-w-4xl mx-auto bg-slate-50 min-h-screen">
      <div className="bg-white p-8 md:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <h1 className="text-3xl font-extrabold text-slate-900">Terms & Conditions</h1>
        <p className="text-xs text-slate-500">Last updated: September 2026 • SBS Technologies</p>

        <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">1. Agreement to Terms</h2>
            <p>
              These Terms and Conditions constitute a legally binding agreement between you and <strong>SBS Technologies</strong> concerning your access to and use of the <strong>FaceAI</strong> biometric platform and attendance management services.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">2. Description of Service</h2>
            <p>
              FaceAI provides software-as-a-service (SaaS) biometric facial recognition, attendance logging, 3D anti-spoofing verification, and HRMS data synchronization based on the purchased subscription tier (Starter, Professional, Enterprise).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">3. Subscription & Billing</h2>
            <p>
              Subscriptions are billed on a recurring monthly or annual basis via authorized payment gateways (Razorpay). Access to platform features is granted immediately upon successful authorization of payment.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">4. User Account & Security</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your organization's workspace.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">5. Contact Information</h2>
            <p>
              For legal inquiries regarding these terms, please contact:
              <br />
              <strong>SBS Technologies</strong>
              <br />
              Email: <a href="mailto:hr@sbstechnologies.in" className="text-blue-600 underline">hr@sbstechnologies.in</a>
              <br />
              Phone: +91 81440 65688
              <br />
              Address: Erode, Tamil Nadu, India - 638004
            </p>
          </section>
        </div>

        <div className="pt-6 border-t border-slate-200 flex justify-between items-center text-xs">
          <Link href="/" className="text-blue-600 font-bold hover:underline">← Back to Home</Link>
          <Link href="/privacy" className="text-slate-600 hover:text-blue-600">Privacy Policy →</Link>
        </div>
      </div>
    </div>
  );
}
