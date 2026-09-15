import type { Metadata } from 'next';
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
        <footer className="border-t border-slate-200 bg-white py-10 px-6 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              <span className="font-semibold text-slate-700">SBS Technologies - FaceAI Platform</span>
            </div>
            <p>© {new Date().getFullYear()} SBS Technologies. All rights reserved. Erode, Tamil Nadu, India.</p>
            <div className="flex gap-4 font-medium">
              <a href="https://www.sbstechnologies.in/faceai" target="_blank" rel="noreferrer" className="text-slate-600 hover:text-blue-600 transition">Official Website</a>
              <a href="mailto:hr@sbstechnologies.in" className="text-slate-600 hover:text-blue-600 transition">hr@sbstechnologies.in</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
