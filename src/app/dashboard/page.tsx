"use client";

import { useEffect, useState } from "react";
import DashboardSection from "../../components/dashboard/DashboardSection";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div 
        className="bg-[var(--bg-page)] min-h-screen" 
        style={{ fontFamily: '"DM Sans", sans-serif' }}
      />
    );
  }

  return (
    <main 
      className="bg-[var(--bg-page)] min-h-screen animate-fade-up" 
      style={{ fontFamily: '"DM Sans", sans-serif' }}
    >
      <DashboardSection onBack={() => router.push("/")} />
    </main>
  );
}
