"use client";

import { useState, useRef, useEffect } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { LogOut, User, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

interface UserMenuProps {
  showName?: boolean;
}

export default function UserMenu({ showName }: UserMenuProps) {
  const { user, isLoaded, isSignedIn } = useUser();
  const clerk = useClerk();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isLoaded || !isSignedIn || !user) return null;

  const initials = user.firstName && user.lastName
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : user.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() ?? "?";

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 p-1 rounded-xl hover:bg-[var(--bg-page)] transition-colors cursor-pointer"
      >
        {user.imageUrl ? (
          <img src={user.imageUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center text-white text-xs font-bold">
            {initials}
          </div>
        )}
        {showName && (
          <>
            <span className="text-sm font-medium text-[var(--text-heading)] max-w-[100px] truncate">
              {user.firstName ?? user.emailAddresses?.[0]?.emailAddress ?? "User"}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-[var(--text-muted)]" />
          </>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl border border-[var(--border)] shadow-[var(--shadow-float)] z-50 py-2">
          <div className="px-4 py-3 border-b border-[var(--border)]">
            <div className="text-sm font-semibold text-[var(--text-heading)] truncate">
              {user.firstName ? `${user.firstName} ${user.lastName ?? ""}` : "User"}
            </div>
            <div className="text-xs text-[var(--text-muted)] truncate">
              {user.emailAddresses?.[0]?.emailAddress ?? ""}
            </div>
          </div>

          <button
            onClick={() => router.push("/user-profile")}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text-body)] hover:bg-[var(--bg-page)] transition-colors cursor-pointer"
          >
            <User className="w-4 h-4" />
            Profile
          </button>

          <button
            onClick={() => clerk.signOut({ redirectUrl: "/" })}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
