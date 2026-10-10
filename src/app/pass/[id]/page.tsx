import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import IDBadge from '@/components/IDBadge';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const pass = await db.skillPass.findUnique({ where: { id } });

  if (!pass) return { title: 'Credential Not Found' };

  return {
    title: `${pass.fullName} - Skill Pass ID`,
    description: `Verified Skill Pass digital credential for ${pass.fullName}`,
  };
}

export default async function PassDetailPage({ params }: PageProps) {
  const { id } = await params;

  const pass = await db.skillPass.findUnique({
    where: { id },
  });

  if (!pass) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <IDBadge pass={pass} />
      </div>
    </main>
  );
}