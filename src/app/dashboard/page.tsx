"use client";

import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import DashboardSection from "../../components/dashboard/DashboardSection";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const storeUser = useMutation(api.users.storeUser);

  useEffect(() => {
    setMounted(true);
    storeUser().catch((err) => console.error("Error syncing user:", err));
  }, [storeUser]);

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
