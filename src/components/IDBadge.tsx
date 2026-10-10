import React from 'react';
import Image from 'next/image';
import { ShieldCheck, Cpu } from 'lucide-react';

interface SkillPassData {
  id: string;
  fullName: string;
  skills: string[];
  pictureUrl: string;
  signatureUrl: string;
  createdAt: Date;
}

export default function IDBadge({ pass }: { pass: SkillPassData }) {
  return (
    <div className="relative w-full max-w-sm mx-auto bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800/80 rounded-3xl p-6 shadow-2xl shadow-cyan-500/10 overflow-hidden text-white font-sans">
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500" />

      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-cyan-400" />
          <span className="font-extrabold tracking-wider text-sm uppercase text-slate-200">Skill Pass ID</span>
        </div>
        <Cpu className="w-5 h-5 text-slate-600" />
      </div>

      <div className="relative w-36 h-36 mx-auto rounded-2xl overflow-hidden border-2 border-cyan-500/30 p-1 bg-slate-950 shadow-inner mb-5">
        <div className="relative w-full h-full rounded-xl overflow-hidden">
          <Image
            src={pass.pictureUrl}
            alt={pass.fullName}
            fill
            sizes="(max-width: 768px) 100vw, 144px"
            className="object-cover"
            priority
          />
        </div>
      </div>

      <div className="text-center space-y-1 mb-6">
        <h1 className="text-xl font-black text-white tracking-tight">{pass.fullName}</h1>
        <p className="text-xs font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-800/30 inline-block px-2.5 py-0.5 rounded-full">
          {pass.id}
        </p>
      </div>

      <div className="mb-6">
        <h2 className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider text-center mb-2">
          Verified Competencies
        </h2>
        <div className="flex flex-wrap justify-center gap-1.5">
          {pass.skills.map((skill) => (
            <span
              key={skill}
              className="text-[11px] bg-slate-800/80 border border-slate-700/50 text-slate-300 px-2.5 py-0.5 rounded-md font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-slate-800/80 flex flex-col items-center">
        <div className="relative w-36 h-12 mb-1">
          <Image
            src={pass.signatureUrl}
            alt="Authorized Signature"
            fill
            sizes="144px"
            className="object-contain filter invert opacity-90"
          />
        </div>
        <div className="w-48 border-t border-slate-700/80 text-center pt-1">
          <span className="text-[9px] font-semibold uppercase text-slate-400 tracking-widest block">
            Authorized Signature
          </span>
        </div>
      </div>
    </div>
  );
}