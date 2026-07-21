"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Mail,
  CheckCircle2,
  Loader2,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/providers/AuthProvider";

export default function VerifyEmailPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  useEffect(() => {
    // If user is already verified and has a session, redirect to dashboard
    if (user && user.email_confirmed_at) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleResend = async () => {
    if (!user?.email) return;
    setResending(true);
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: user.email,
    });
    setResending(false);
    if (!error) {
      setResent(true);
      setTimeout(() => setResent(false), 5000);
    }
  };

  return (
    <AuthLayout
      title="Verify Your Email"
      subtitle="Check your inbox for a verification link"
    >
      <div className="flex flex-col items-center gap-6 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex h-20 w-20 items-center justify-center rounded-full border border-gold/20 bg-gold/10"
        >
          <Mail className="h-10 w-10 text-gold" />
        </motion.div>

        <div className="space-y-2">
          <p className="text-sm text-[var(--color-text-secondary)]">
            We&apos;ve sent a verification link to your email address. Click the
            link in the email to verify your account.
          </p>
          {user?.email && (
            <p className="text-sm font-medium text-[var(--color-text-primary)]">
              {user.email}
            </p>
          )}
        </div>

        {resent && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 rounded-lg border border-green-500/20 bg-green-500/5 px-3 py-2 text-sm text-green-400"
          >
            <CheckCircle2 className="h-4 w-4" />
            Verification email resent!
          </motion.div>
        )}

        <button
          onClick={handleResend}
          disabled={resending}
          className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface)] px-5 py-2.5 text-sm font-medium text-[var(--color-text-primary)] transition-all hover:border-gold/30 hover:text-gold disabled:opacity-50"
        >
          {resending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4" />
              Resend verification email
            </>
          )}
        </button>

        <div className="flex w-full flex-col gap-2 border-t border-[var(--color-border-default)] pt-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gold px-7 py-3 text-sm font-semibold text-black transition-all hover:bg-gold-hover hover:shadow-glow-md"
          >
            Continue to Dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="text-xs text-[var(--color-text-muted)]">
            You can continue without verifying, but some features may be
            limited.
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}