"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth, UserRole } from "@/components/providers/AuthProvider";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { user, role, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/login");
      return;
    }
    if (allowedRoles && !allowedRoles.includes(role)) {
      router.push("/dashboard");
    }
  }, [user, role, loading, router, allowedRoles]);

  // Keep the loading shell mounted during redirect to avoid a null flash.
  // The router.push is async; rendering null while it's pending exposes
  // protected content briefly or causes a blank frame.
  if (loading || !user || (allowedRoles && !allowedRoles.includes(role))) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-gold" />
          <p className="text-sm text-[var(--color-text-secondary)]">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
