import { useState } from 'react';
import Link from 'next/link';
import { Show, UserButton } from "@clerk/nextjs";
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { ArrowRight } from 'lucide-react';

export default function Navbar({
  onStartDashboard,
  isDashboard = false,
}: {
  onStartDashboard?: () => void;
  isDashboard?: boolean;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = ['Solutions', 'Features', 'Integrations', 'Pricing'];

  return (
    <nav
      className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-black/5"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="section-container flex items-center justify-between h-16">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 shrink-0">
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

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {isDashboard ? (
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.location.reload(); // Quick way to go home or use callback
              }}
              className="nav-link text-sm font-medium text-[var(--text-body)] hover:text-[var(--text-heading)] transition-colors duration-200"
            >
              Home Page
            </a>
          ) : (
            links.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="nav-link text-sm font-medium text-[var(--text-body)] hover:text-[var(--text-heading)] transition-colors duration-200"
              >
                {link}
              </a>
            ))
          )}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-4">
          {isDashboard ? (
            <>
              <Badge className="text-xs px-2.5 py-1">
                Active Session
              </Badge>
              <UserButton />
            </>
          ) : (
            <>
              <Show when="signed-out">
                <Link href="/sign-in">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="primary" size="sm" className="group">
                    Launch Dashboard
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Button>
                </Link>
              </Show>
              <Show when="signed-in">
                <Link href="/dashboard">
                  <Button variant="outline" size="sm" className="group">
                    Go to Dashboard
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Button>
                </Link>
                <UserButton />
              </Show>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-[var(--text-heading)]"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle mobile menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? (
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M6 18L18 6" />
            </svg>
          ) : (
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-black/5 px-4 pb-5 pt-2">
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="py-3 px-2 text-sm font-medium text-[var(--text-body)] hover:text-[var(--text-heading)] hover:bg-[var(--bg-page)] rounded-lg transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link}
              </a>
            ))}
          </div>
          <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-black/5">
            <Show when="signed-out">
              <Link href="/sign-in">
                <Button variant="ghost" size="md" className="w-full" onClick={() => setMobileOpen(false)}>
                  Sign In
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="primary" size="md" className="w-full group" onClick={() => setMobileOpen(false)}>
                  Launch Dashboard
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </Show>
            <Show when="signed-in">
              <Link href="/dashboard">
                <Button variant="outline" size="md" className="w-full group mb-2" onClick={() => setMobileOpen(false)}>
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <div className="flex justify-center py-2">
                <UserButton showName />
              </div>
            </Show>
          </div>
        </div>
      )}
    </nav>
  );
}
