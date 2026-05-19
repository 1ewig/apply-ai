import { AlertTriangle } from 'lucide-react';

interface ErrorToastProps {
  error: string | null;
  onDismiss: () => void;
}

export default function ErrorToast({ error, onDismiss }: ErrorToastProps) {
  if (!error) return null;

  return (
    <div className="bg-rose-50 border-b border-rose-200 px-6 py-3.5 flex justify-between items-center text-rose-800 text-xs font-medium shrink-0">
      <span className="flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-rose-600" />
        {error}
      </span>
      <button onClick={onDismiss} className="underline cursor-pointer hover:text-rose-900">Dismiss</button>
    </div>
  );
}
