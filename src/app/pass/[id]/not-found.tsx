import Link from 'next/link';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function NotFoundPass() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-center">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl max-w-md w-full shadow-2xl">
        <ShieldAlert className="w-16 h-16 text-amber-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Credential Not Found</h1>
        <p className="text-slate-400 text-sm mb-6">
          The requested Skill Pass ID does not exist, has expired, or was revoked from our serverless database.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-medium px-5 py-2.5 rounded-xl transition text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Issue New Pass
        </Link>
      </div>
    </div>
  );
}