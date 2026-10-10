export default function LoadingPass() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-slate-900/50 border border-slate-800 rounded-3xl p-6 space-y-6 animate-pulse">
        <div className="h-6 bg-slate-800 rounded w-1/3 mx-auto" />
        <div className="w-36 h-36 bg-slate-800 rounded-2xl mx-auto" />
        <div className="space-y-2">
          <div className="h-5 bg-slate-800 rounded w-1/2 mx-auto" />
          <div className="h-4 bg-slate-800/60 rounded w-1/3 mx-auto" />
        </div>
        <div className="flex justify-center gap-2">
          <div className="h-6 w-16 bg-slate-800 rounded-md" />
          <div className="h-6 w-16 bg-slate-800 rounded-md" />
        </div>
        <div className="h-10 bg-slate-800/40 rounded w-36 mx-auto pt-4" />
      </div>
    </div>
  );
}