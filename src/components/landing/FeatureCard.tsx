import Card from '../ui/Card';

interface FeatureCardProps {
  title: string;
  caption: string;
  children: React.ReactNode;
}

export default function FeatureCard({ title, caption, children }: FeatureCardProps) {
  return (
    <Card hover className="overflow-hidden flex flex-col">
      <div className="bg-[#F8FAFC] p-6 flex items-center justify-center min-h-[200px] border-b border-[var(--border)]">
        {children}
      </div>
      <div className="p-6">
        <h3 className="font-display font-bold text-lg text-[var(--text-heading)] mb-2">
          {title}
        </h3>
        <p className="text-sm text-[var(--text-body)] leading-relaxed">{caption}</p>
      </div>
    </Card>
  );
}
