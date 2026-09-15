import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'FaceAI | Next-Gen AI Face Recognition & Biometric Attendance',
  description: 'Military-grade facial recognition, anti-spoofing, and automated attendance by SBS Technologies.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        
        {/* Compliance-Ready Footer */}
        <footer className="border-t border-slate-200 bg-white py-12 px-6 text-xs text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                <span className="font-bold text-slate-800 text-sm">SBS Technologies — FaceAI</span>
              </div>
              <p className="mt-1 text-slate-500">Erode, Tamil Nadu, India — PIN 638004</p>
              <p className="mt-0.5 text-slate-400">© {new Date().getFullYear()} SBS Technologies. All rights reserved.</p>
            </div>

            {/* Mandatory Regulatory & Policy Links */}
            <div className="flex flex-wrap items-center justify-center gap-6 font-medium text-slate-600">
              <Link href="/privacy" className="hover:text-blue-600 transition">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-blue-600 transition">Terms & Conditions</Link>
              <Link href="/refund" className="hover:text-blue-600 transition">Refund Policy</Link>
              <Link href="/contact" className="hover:text-blue-600 transition">Contact Us</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
