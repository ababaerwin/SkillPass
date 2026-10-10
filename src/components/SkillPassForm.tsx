'use client';

import React, { useState, useRef } from 'react';
import ReactSignatureCanvas from 'react-signature-canvas';
import { upload } from '@vercel/blob/client';
import { createSkillPass } from '@/app/actions';
import { useRouter } from 'next/navigation';
import { Loader2, Upload, Trash2, Plus, X } from 'lucide-react';

export default function SkillPassForm() {
  const router = useRouter();
  const sigCanvas = useRef<ReactSignatureCanvas | null>(null);

  const [fullName, setFullName] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAddSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('Profile photo must be less than 5MB.');
        return;
      }
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        setErrorMessage('Profile photo must be JPEG or PNG format.');
        return;
      }
      setErrorMessage(null);
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const clearSignature = () => {
    sigCanvas.current?.clear();
  };

  const convertCanvasToFile = (): Promise<File> => {
    return new Promise((resolve, reject) => {
      if (!sigCanvas.current || sigCanvas.current.isEmpty()) {
        reject(new Error('Digital signature is required.'));
        return;
      }

      const canvas = sigCanvas.current.getTrimmedCanvas();
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `signature-${Date.now()}.png`, {
            type: 'image/png',
          });
          resolve(file);
        } else {
          reject(new Error('Failed to capture signature canvas content.'));
        }
      }, 'image/png');
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (skills.length === 0) {
      setErrorMessage('Please add at least one skill tag.');
      return;
    }
    if (!photoFile) {
      setErrorMessage('Please upload a profile photo.');
      return;
    }

    try {
      setIsSubmitting(true);
      const signatureFile = await convertCanvasToFile();

      const photoBlob = await upload(`photos/${photoFile.name}`, photoFile, {
        access: 'public',
        handleUploadUrl: '/api/upload',
      });

      const signatureBlob = await upload(`signatures/${signatureFile.name}`, signatureFile, {
        access: 'public',
        handleUploadUrl: '/api/upload',
      });

      const createdPass = await createSkillPass({
        fullName: fullName.trim(),
        skills,
        pictureUrl: photoBlob.url,
        signatureUrl: signatureBlob.url,
      });

      router.push(`/pass/${createdPass.id}`);
    } catch (err) {
      setErrorMessage((err as Error).message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6 bg-slate-900/90 border border-slate-800 p-8 rounded-2xl shadow-2xl backdrop-blur-md">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Issue Skill Pass Credential</h2>
        <p className="text-sm text-slate-400 mt-1">Provide your credentials and digital signature to create your verification badge.</p>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {errorMessage}
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold uppercase text-slate-300 tracking-wider mb-2">Full Name</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="e.g. Alex Mercer"
          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase text-slate-300 tracking-wider mb-2">Technical Skills</label>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
            placeholder="Add skill (e.g. Next.js) and hit Add"
            className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
          />
          <button
            type="button"
            onClick={handleAddSkill}
            className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-3 rounded-lg font-medium transition flex items-center gap-1"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span key={skill} className="inline-flex items-center gap-1 bg-cyan-950/60 border border-cyan-800/50 text-cyan-300 px-3 py-1 rounded-full text-xs font-medium">
              {skill}
              <button type="button" onClick={() => handleRemoveSkill(skill)} className="hover:text-cyan-100">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase text-slate-300 tracking-wider mb-2">Profile Photo (Max 5MB)</label>
        <div className="flex items-center gap-4">
          <div className="relative w-24 h-24 rounded-xl border border-slate-800 bg-slate-950 overflow-hidden flex items-center justify-center shrink-0">
            {photoPreview ? (
              <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <Upload className="w-6 h-6 text-slate-600" />
            )}
          </div>
          <input
            type="file"
            accept="image/jpeg,image/png"
            onChange={handlePhotoChange}
            className="block w-full text-sm text-slate-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-cyan-500/10 file:text-cyan-400 hover:file:bg-cyan-500/20 file:transition cursor-pointer"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-xs font-semibold uppercase text-slate-300 tracking-wider">Digital Signature</label>
          <button
            type="button"
            onClick={clearSignature}
            className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition"
          >
            <Trash2 className="w-3 h-3" /> Clear Canvas
          </button>
        </div>
        <div className="border border-slate-800 bg-white rounded-xl overflow-hidden touch-none">
          <ReactSignatureCanvas
            ref={sigCanvas}
            penColor="#0f172a"
            canvasProps={{ className: 'w-full h-36 cursor-crosshair' }}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-800/50 text-slate-950 font-bold py-3.5 px-6 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" /> Issuing Digital Credential...
          </>
        ) : (
          'Generate & Issue Skill Pass'
        )}
      </button>
    </form>
  );
}