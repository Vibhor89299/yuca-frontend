import { Loader2 } from 'lucide-react';

export function PageLoadingFallback() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-blanket/30">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-autumnFern" />
        <p className="text-sm text-khakiMoss animate-pulse">Loading...</p>
      </div>
    </div>
  );
}
