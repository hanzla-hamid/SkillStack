"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";

export default function LogoutPage() {
  const router = useRouter();
  const { signOut } = useAuth();

  useEffect(() => {
    (async () => {
      await signOut();
      router.push("/");
      router.refresh();
    })();
  }, [router, signOut]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
        <p className="text-sm text-[var(--color-text-secondary)]">
          Signing out...
        </p>
      </div>
    </div>
  );
}