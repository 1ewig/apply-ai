import { cn } from '@/utils/cn';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export default function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-block rounded-full border border-[var(--border)] bg-[var(--bg-surface)] px-4 py-1 text-sm font-medium font-mono',
        'text-[var(--text-body)]',
        className
      )}
    >
      {children}
    </span>
  );
}
