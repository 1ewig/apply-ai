import { cn } from '@/utils/cn';
import Button from '../ui/Button';
import { LucideIcon } from 'lucide-react';

interface PricingCardProps {
  name: string;
  price: number;
  tagline: string;
  features: string[];
  highlighted?: boolean;
  Icon?: LucideIcon;
  ctaText?: string;
}

export default function PricingCard({
  name,
  price,
  tagline,
  features,
  highlighted = false,
  Icon,
  ctaText = 'Get started',
}: PricingCardProps) {
  return (
    <div
      className={cn(
        'relative rounded-[var(--radius-card)] border p-7 flex flex-col',
        highlighted
          ? 'bg-[var(--accent)] text-white border-transparent scale-[1.04] shadow-[var(--shadow-float)] z-10'
          : 'bg-[var(--bg-surface)] border-[var(--border)] shadow-[var(--shadow-card)]',
        'transition-all duration-300 hover:-translate-y-1'
      )}
    >
      {Icon && (
        <div className="absolute -top-4 -right-3 w-10 h-10 bg-[var(--accent-yellow)] rounded-xl flex items-center justify-center text-[#92400E] shadow-lg animate-bounce">
          <Icon className="w-5 h-5 fill-[#92400E]" />
        </div>
      )}

      <div className="mb-6">
        <h3
          className={cn(
            'font-display font-bold text-xl mb-1',
            highlighted ? 'text-white' : 'text-[var(--text-heading)]'
          )}
        >
          {name}
        </h3>
        <p
          className={cn(
            'text-sm',
            highlighted ? 'text-white/70' : 'text-[var(--text-muted)]'
          )}
        >
          {tagline}
        </p>
      </div>

      <div className="mb-6">
        <span
          className={cn(
            'font-display font-extrabold text-5xl',
            highlighted ? 'text-white' : 'text-[var(--text-heading)]'
          )}
        >
          ${price}
        </span>
        <span
          className={cn(
            'text-sm ml-1',
            highlighted ? 'text-white/60' : 'text-[var(--text-muted)]'
          )}
        >
          /mo
        </span>
      </div>

      <Button
        variant={highlighted ? 'outline' : 'primary'}
        size="md"
        className={cn(
          'w-full mb-6',
          highlighted && 'border-white/40 text-white hover:bg-white/15'
        )}
      >
        {ctaText}
      </Button>

      <ul className="space-y-3 flex-1">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm">
            <svg
              className={cn(
                'w-4 h-4 mt-0.5 shrink-0',
                highlighted ? 'text-white' : 'text-[var(--accent)]'
              )}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span className={highlighted ? 'text-white/90' : 'text-[var(--text-body)]'}>
              {feature}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
