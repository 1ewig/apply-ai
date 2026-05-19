import { Calendar, Clock, CheckCircle2, Sparkles, BarChart3, Flag } from 'lucide-react';

const footerLinks = [
  {
    title: 'Product',
    links: ['Features', 'Integrations', 'Pricing'],
  },
  {
    title: 'Company',
    links: ['About', 'Blog', 'Careers'],
  },
  {
    title: 'Resources',
    links: ['Docs', 'Changelog', 'Status'],
  },
];

const floatingIcons = [
  { icon: Calendar, color: '#3B82F6' },
  { icon: Clock, color: '#EF4444' },
  { icon: CheckCircle2, color: '#10B981' },
  { icon: Sparkles, color: '#06B6D4' },
  { icon: BarChart3, color: '#8B5CF6' },
  { icon: Flag, color: '#FACC15' },
];

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[var(--border)]">
      <div className="section-container" style={{ paddingBlock: 'clamp(3rem, 6vw, 5rem)' }}>
        {/* Floating decorative icons */}
        <div className="flex items-center justify-center gap-4 mb-10">
          {floatingIcons.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="w-10 h-10 bg-[var(--bg-page)] rounded-xl flex items-center justify-center hover:animate-float transition-all duration-300 hover:-translate-y-1 cursor-default border border-[var(--border)]"
              >
                <Icon className="w-4 h-4" style={{ color: item.color }} />
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left — Logo & tagline */}
          <div>
            <a href="#" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 grid grid-cols-2 gap-1">
                <div className="w-3 h-3 rounded-full bg-[var(--accent)]" />
                <div className="w-3 h-3 rounded-full bg-[var(--accent-cyan)]" />
                <div className="w-3 h-3 rounded-full bg-[var(--accent-yellow)]" />
                <div className="w-3 h-3 rounded-full bg-[var(--accent)]" />
              </div>
              <span className="font-display font-bold text-lg text-[var(--text-heading)]">
                ApplyAI
              </span>
            </a>
            <p className="text-sm text-[var(--text-muted)] mb-4">
              Track smarter. Land faster.
            </p>
            <p className="text-xs text-[var(--text-muted)]">
              © {new Date().getFullYear()} ApplyAI. All rights reserved.
            </p>
          </div>

          {/* Right — Link columns */}
          <div className="grid grid-cols-3 gap-6">
            {footerLinks.map((group) => (
              <div key={group.title}>
                <h4 className="font-display font-bold text-sm text-[var(--text-heading)] mb-4">
                  {group.title}
                </h4>
                <ul className="space-y-2.5">
                  {group.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-[var(--text-muted)] hover:text-[var(--text-heading)] transition-colors duration-200"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
