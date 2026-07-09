import { AlertTriangle } from 'lucide-react';

interface ErrorToastProps {
  error: string | null;
  onDismiss: () => void;
}

export default function ErrorToast({ error, onDismiss }: ErrorToastProps) {
  if (!error) return null;

  return (
    <div className="bg-rose-500/10 border-b border-rose-500/20 px-6 py-3.5 flex justify-between items-center text-rose-500 text-xs font-medium shrink-0">
      <span className="flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-rose-600" />
        {error}
      </span>
      <button onClick={onDismiss} className="underline cursor-pointer hover:text-rose-600">Dismiss</button>
    </div>
  );
}
