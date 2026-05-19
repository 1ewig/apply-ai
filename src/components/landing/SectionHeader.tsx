import { cn } from '@/utils/cn';
import Badge from '../ui/Badge';

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
        'mb-10',
        align === 'center' && 'text-center',
        className
      )}
    >
      <Badge className="mb-4">{badge}</Badge>
      <h2
        className="font-display font-bold text-[var(--text-heading)] mt-4"
        style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', lineHeight: 1.15 }}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base md:text-lg text-[var(--text-body)] max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
