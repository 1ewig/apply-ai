import { useReveal } from '@/hooks/useReveal';
import SectionHeader from './ui/SectionHeader';
import Card from '../ui/Card';
import {
  Mail,
  Folder,
  Calendar,
  MessageSquare,
  FileText,
  Briefcase,
  Terminal,
  Inbox,
  Palette,
  Sprout,
  Sliders,
  Building2,
  Heart,
  MessageCircle,
  Zap,
} from 'lucide-react';

const integrations = [
  { name: 'Gmail', icon: Mail, color: '#EA4335' },
  { name: 'Google Drive', icon: Folder, color: '#4285F4' },
  { name: 'Google Calendar', icon: Calendar, color: '#0F9D58' },
  { name: 'Slack', icon: MessageSquare, color: '#4A154B' },
  { name: 'Notion', icon: FileText, color: '#000000' },
  { name: 'LinkedIn', icon: Briefcase, color: '#0A66C2' },
  { name: 'GitHub', icon: Terminal, color: '#24292F' },
  { name: 'Outlook', icon: Inbox, color: '#0078D4' },
  { name: 'Figma', icon: Palette, color: '#F24E1E' },
  { name: 'Greenhouse', icon: Sprout, color: '#24A47F' },
  { name: 'Lever', icon: Sliders, color: '#2DC5A1' },
  { name: 'Workday', icon: Building2, color: '#0875E1' },
  { name: 'HubSpot', icon: Heart, color: '#FF7A59' },
  { name: 'Intercom', icon: MessageCircle, color: '#1F8DED' },
  { name: 'Zapier', icon: Zap, color: '#FF4F00' },
];

export default function IntegrationsSection() {
  const ref = useReveal();

  return (
    <section id="integrations" className="section-gap">
      <div ref={ref} className="section-container reveal">
        <SectionHeader
          badge="Integrations"
          title="Connect the tools you already use"
        />

        {/* Central icon */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-[var(--accent)] rounded-2xl shadow-lg flex items-center justify-center mb-4">
            <div className="w-7 h-7 grid grid-cols-2 gap-0.5">
              <div className="w-3 h-3 rounded-full bg-white" />
              <div className="w-3 h-3 rounded-full bg-[var(--accent-cyan)]" />
              <div className="w-3 h-3 rounded-full bg-[var(--accent-yellow)]" />
              <div className="w-3 h-3 rounded-full bg-white" />
            </div>
          </div>
          {/* Connector line */}
          <div className="w-px h-8 bg-gradient-to-b from-[var(--accent)] to-transparent" />
        </div>

        {/* Integration grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 max-w-3xl mx-auto">
          {integrations.map((int, i) => {
            const Icon = int.icon;
            return (
              <Card
                key={i}
                hover
                className="p-4 flex flex-col items-center justify-center gap-2 text-center"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: int.color + '12', color: int.color }}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-medium text-[var(--text-heading)] leading-tight">
                  {int.name}
                </span>
              </Card>
            );
          })}
        </div>

        {/* + more pill */}
        <div className="text-center mt-8">
          <span className="inline-block rounded-full border border-[var(--border)] bg-white px-5 py-2 text-sm text-[var(--text-body)] font-medium">
            + 50 more integrations
          </span>
        </div>
      </div>
    </section>
  );
}
