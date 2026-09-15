import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="py-16 px-6 max-w-4xl mx-auto bg-slate-50 min-h-screen">
      <div className="bg-white p-8 md:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <h1 className="text-3xl font-extrabold text-slate-900">Privacy Policy</h1>
        <p className="text-xs text-slate-500">Last updated: September 2026 • SBS Technologies</p>

        <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">1. Information We Collect</h2>
            <p>
              We collect information provided directly by organizational administrators, including company name, administrator email, billing information, and mathematical biometric vector representations for employee attendance logging.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">2. Biometric Data & AES-256 Encryption</h2>
            <p>
              FaceAI does not store unencrypted raw facial photographs. All facial geometry is transformed into 512-dimensional mathematical embeddings and encrypted at rest using military-grade <strong>AES-256 standards</strong>.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">3. Payment Information Security</h2>
            <p>
              All payment transactions are processed through certified PCI-DSS Level 1 payment processors (Razorpay). We do not store credit card numbers, CVVs, or bank login credentials on our servers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">4. Third-Party Sharing</h2>
            <p>
              We do not sell, trade, or rent personal or biometric data to third parties. Data is used exclusively for providing your organization's attendance verification services.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">5. Contact Us</h2>
            <p>
              For privacy inquiries:
              <br />
              Email: <a href="mailto:hr@sbstechnologies.in" className="text-blue-600 underline">hr@sbstechnologies.in</a>
              <br />
              SBS Technologies, Erode, Tamil Nadu, India - 638004
            </p>
          </section>
        </div>

        <div className="pt-6 border-t border-slate-200 flex justify-between items-center text-xs">
          <Link href="/" className="text-blue-600 font-bold hover:underline">← Back to Home</Link>
          <Link href="/refund" className="text-slate-600 hover:text-blue-600">Refund Policy →</Link>
        </div>
      </div>
    </div>
  );
}
