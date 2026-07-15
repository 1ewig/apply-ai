import { cn } from '@/utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'outline' | 'white-outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  className,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center font-medium transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]';

  const variants = {
    primary:
      'bg-[var(--accent)] text-white rounded-full hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] disabled:hover:scale-100 disabled:active:scale-100',
    ghost:
      'text-[var(--text-body)] hover:text-[var(--text-heading)] rounded-full disabled:hover:text-[var(--text-body)]',
    outline:
      'border border-[var(--border)] rounded-full hover:bg-[var(--bg-page)] text-[var(--text-heading)] disabled:hover:bg-transparent',
    'white-outline':
      'border border-white/30 rounded-full hover:bg-white/10 text-white disabled:hover:bg-transparent',
    danger:
      'bg-rose-500/90 text-white rounded-full hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] disabled:hover:scale-100 disabled:active:scale-100',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-7 py-3.5 text-base gap-2',
  };

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
