import DashboardLayoutClient from '@/components/(dashboard)/DashboardLayoutClient';

export const metadata = {
  title: 'Dashboard | ApplyAI',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="bg-[var(--bg-page)] min-h-dvh animate-fade-up" style={{ fontFamily: '"DM Sans", sans-serif' }}>
      <div className="flex min-h-dvh bg-[var(--bg-page)] text-[var(--text-body)]">
        <DashboardLayoutClient>{children}</DashboardLayoutClient>
      </div>
    </main>
  );
}
