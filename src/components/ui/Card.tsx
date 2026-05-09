import { cn } from '@/utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className, hover = false }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-card)] border border-[var(--border)]',
        hover && 'transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-float)]',
        className
      )}
    >
      {children}
    </div>
  );
}
