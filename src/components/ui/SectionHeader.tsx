import { cn } from '@/utils/cn';
import Badge from './Badge';

interface SectionHeaderProps {
  badge: string;
  title: string;
  subtitle?: string;
  align?: 'center' | 'left';
  className?: string;
}

export default function SectionHeader({
  badge,
  title,
  subtitle,
  align = 'center',
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'mb-12',
        align === 'center' && 'text-center',
        className
      )}
    >
      <Badge className="mb-4">{badge}</Badge>
      <h2
        className="font-display font-bold text-[var(--text-heading)] mt-4"
        style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', lineHeight: 1.15 }}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-lg text-[var(--text-body)] max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
