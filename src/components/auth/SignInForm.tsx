"use client";

import { useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "../ui/Button";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function SignInForm() {
  const { signIn, fetchStatus } = useSignIn();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error: signInError } = await signIn.password({
        emailAddress: email,
        password,
      });

      if (signInError) {
        setError("Invalid email or password.");
        return;
      }

      if (signIn.status === "complete") {
        await signIn.finalize({
          navigate: ({ decorateUrl }) => {
            const url = decorateUrl("/dashboard");
            if (url.startsWith("http")) {
              window.location.href = url;
            } else {
              router.push(url);
            }
          },
        });
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.longMessage ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setError("");
    setLoading(true);

    try {
      await signIn.sso({
        strategy: "oauth_google",
        redirectUrl: "/dashboard",
        redirectCallbackUrl: "/sso-callback",
      });
    } catch (err: any) {
      setError(err.errors?.[0]?.longMessage ?? "Failed to sign in with Google.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-10 h-10 grid grid-cols-2 gap-1">
            <div className="w-4 h-4 rounded-full bg-[var(--accent)]" />
            <div className="w-4 h-4 rounded-full bg-[var(--accent-cyan)]" />
            <div className="w-4 h-4 rounded-full bg-[var(--accent-yellow)]" />
            <div className="w-4 h-4 rounded-full bg-[var(--accent)]" />
          </div>
        </div>
        <h1 className="font-display font-extrabold text-2xl text-[var(--text-heading)]">Welcome back</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Sign in to your ApplyAI workspace</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 text-sm text-rose-700 font-medium">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-[var(--text-heading)] mb-1.5">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-white text-[var(--text-heading)] text-sm outline-2 outline-offset-[-1px] outline-transparent focus:outline-[var(--accent)] transition-all"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-semibold text-[var(--text-heading)] mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-white text-[var(--text-heading)] text-sm outline-2 outline-offset-[-1px] outline-transparent focus:outline-[var(--accent)] transition-all pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-heading)] cursor-pointer"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <Button type="submit" variant="primary" size="lg" className="w-full justify-center" disabled={loading || fetchStatus === "fetching"}>
          {loading || fetchStatus === "fetching" ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {loading || fetchStatus === "fetching" ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[var(--border)]" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-[var(--bg-page)] px-3 text-xs font-semibold text-[var(--text-muted)]">or continue with</span>
        </div>
      </div>

      <button
        onClick={signInWithGoogle}
        disabled={loading || fetchStatus === "fetching"}
        className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border border-[var(--border)] bg-white text-sm font-semibold text-[var(--text-heading)] hover:bg-slate-50 transition-all cursor-pointer disabled:opacity-50"
      >
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        Continue with Google
      </button>

      <p className="text-center text-sm text-[var(--text-muted)] mt-6">
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" className="font-semibold text-[var(--accent)] hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
