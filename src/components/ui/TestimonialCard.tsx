import Card from './Card';

interface TestimonialCardProps {
  name: string;
  role: string;
  quote: string;
  avatarColor?: string;
}

export default function TestimonialCard({
  name,
  role,
  quote,
  avatarColor = '#2563EB',
}: TestimonialCardProps) {
  return (
    <Card hover className="p-6 flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-display font-bold text-sm shrink-0"
          style={{ background: avatarColor }}
        >
          {name.split(' ').map(n => n[0]).join('')}
        </div>
        <div>
          <p className="font-display font-bold text-sm text-[var(--text-heading)]">
            {name}
          </p>
          <p className="text-xs text-[var(--text-muted)]">{role}</p>
        </div>
      </div>
      <p className="text-sm text-[var(--text-body)] leading-relaxed flex-1">
        "{quote}"
      </p>
      <div className="flex gap-0.5 mt-4">
        {[...Array(5)].map((_, i) => (
          <svg key={i} className="w-4 h-4 text-[var(--accent-yellow)]" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    </Card>
  );
}
