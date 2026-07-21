"use client";

import { useState, Suspense, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  AlertCircle,
  Loader2,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const [loginType, setLoginType] = useState<"email" | "username">("email");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("skillstack_remember");
    if (saved) {
      setIdentifier(saved);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let email = identifier;

      if (loginType === "username") {
        const { data: resolvedEmail, error: rpcError } = await supabase.rpc(
          "lookup_email_by_username",
          { p_username: identifier },
        );

        if (rpcError || !resolvedEmail) {
          setError("User not found. Please check your username.");
          setLoading(false);
          return;
        }
        email = resolvedEmail as string;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }

      if (rememberMe && loginType === "email") {
        localStorage.setItem("skillstack_remember", email);
      } else {
        localStorage.removeItem("skillstack_remember");
      }

      const next = searchParams.get("next");
      router.push(next && next.startsWith("/") ? next : "/dashboard");
      router.refresh();
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  const handlePasswordKey = (e: React.KeyboardEvent) => {
    if (e.getModifierState && e.getModifierState("CapsLock")) {
      setCapsLockOn(true);
    } else {
      setCapsLockOn(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to continue your learning journey"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Login type toggle */}
        <div className="flex gap-2 rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface)] p-1">
          <button
            type="button"
            onClick={() => setLoginType("email")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
              loginType === "email"
                ? "bg-gold/10 text-gold"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            <Mail className="h-3.5 w-3.5" />
            Email
          </button>
          <button
            type="button"
            onClick={() => setLoginType("username")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
              loginType === "username"
                ? "bg-gold/10 text-gold"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            <User className="h-3.5 w-3.5" />
            Username
          </button>
        </div>

        {/* Identifier */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--color-text-primary)]">
            {loginType === "email" ? "Email Address" : "Username"}
          </label>
          <div className="relative">
            {loginType === "email" ? (
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
            ) : (
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
            )}
            <input
              type={loginType === "email" ? "email" : "text"}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={
                loginType === "email" ? "you@example.com" : "your_username"
              }
              required
              className="w-full rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface)] py-2.5 pl-10 pr-4 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] transition-colors focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--color-text-primary)]">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
            <input
              ref={passwordRef}
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handlePasswordKey}
              placeholder="Enter your password"
              required
              className="w-full rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface)] py-2.5 pl-10 pr-10 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] transition-colors focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] transition-colors hover:text-gold"
              aria-label="Toggle password visibility"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {/* Caps Lock warning */}
          <AnimatePresence>
            {capsLockOn && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-1.5 flex items-center gap-1.5 text-xs text-amber-500"
              >
                <ShieldCheck className="h-3 w-3" />
                Caps Lock is on
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Remember me + Forgot password */}
        <div className="flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-[var(--color-text-secondary)]">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-[var(--color-border-default)] bg-[var(--color-surface)] accent-gold"
            />
            Remember me
          </label>
          <Link
            href="/forgot-password"
            className="text-sm text-gold transition-colors hover:text-gold-hover"
          >
            Forgot password?
          </Link>
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2.5 text-sm text-red-400"
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-gold px-7 py-3 text-sm font-semibold text-black transition-all duration-300 hover:bg-gold-hover hover:shadow-glow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              Sign In
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>

        {/* Register link */}
        <p className="text-center text-sm text-[var(--color-text-secondary)]">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-gold transition-colors hover:text-gold-hover"
          >
            Create one
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
