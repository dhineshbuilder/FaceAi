import Link from 'next/link';

export default function RefundPage() {
  return (
    <div className="py-16 px-6 max-w-4xl mx-auto bg-slate-50 min-h-screen">
      <div className="bg-white p-8 md:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <h1 className="text-3xl font-extrabold text-slate-900">Cancellation & Refund Policy</h1>
        <p className="text-xs text-slate-500">Last updated: September 2026 • SBS Technologies</p>

        <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">1. Subscription Cancellation</h2>
            <p>
              You can cancel your FaceAI subscription at any time directly through your account dashboard or by writing to our support team at <a href="mailto:hr@sbstechnologies.in" className="text-blue-600 underline">hr@sbstechnologies.in</a>. Upon cancellation, your workspace remains active until the end of the current billing cycle.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">2. Refund Eligibility</h2>
            <p>
              We offer a <strong>7-day money-back guarantee</strong> for new subscription purchases if the service does not meet your organizational requirements or technical compatibility benchmarks.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">3. Processing of Refunds</h2>
            <p>
              Approved refunds are credited back to the original payment method (bank account / UPI / credit card) within <strong>5–7 business days</strong> as per standard banking settlement rules via Razorpay.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">4. Support & Dispute Inquiries</h2>
            <p>
              If you have any billing or charge disputes, please reach out to:
              <br />
              <strong>SBS Technologies Billing Support</strong>
              <br />
              Email: <a href="mailto:hr@sbstechnologies.in" className="text-blue-600 underline">hr@sbstechnologies.in</a>
              <br />
              Phone: +91 81440 65688
            </p>
          </section>
        </div>

        <div className="pt-6 border-t border-slate-200 flex justify-between items-center text-xs">
          <Link href="/" className="text-blue-600 font-bold hover:underline">← Back to Home</Link>
          <Link href="/contact" className="text-slate-600 hover:text-blue-600">Contact Us →</Link>
        </div>
      </div>
    </div>
  );
}
