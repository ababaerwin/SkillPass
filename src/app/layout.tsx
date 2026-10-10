import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Skill Pass ID Generator',
  description: 'Generate secure digital skill credentials on Vercel',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 antialiased">{children}</body>
    </html>
  );
}