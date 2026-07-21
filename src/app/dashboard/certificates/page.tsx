"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Award,
  Download,
  Loader2,
  Search,
  ShieldCheck,
  Calendar,
} from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { GlassCard } from "@/components/shared";
import { supabase, Certificate } from "@/lib/supabase";
import { useAuth } from "@/components/providers/AuthProvider";

function CertificatesContent() {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifyNumber, setVerifyNumber] = useState("");
  const [verifyResult, setVerifyResult] = useState<
    Certificate | null | "not_found"
  >(null);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    fetchCertificates();
  }, [user]);

  const fetchCertificates = async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from("certificates")
      .select("*")
      .eq("user_id", user.id)
      .order("issued_at", { ascending: false });
    setCertificates((data as Certificate[]) || []);
    setLoading(false);
  };

  const handleVerify = async () => {
    if (!verifyNumber.trim()) return;
    setVerifying(true);
    setVerifyResult(null);
    const { data } = await supabase
      .from("certificates")
      .select("*")
      .eq("certificate_number", verifyNumber.trim())
      .maybeSingle();
    setVerifyResult(data ? (data as Certificate) : "not_found");
    setVerifying(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Your certificates */}
      <div>
        <h2 className="mb-4 font-display text-lg font-semibold text-[var(--color-text-primary)]">
          Your Certificates
        </h2>

        {certificates.length === 0 ? (
          <GlassCard className="p-8" hover={false}>
            <div className="flex flex-col items-center gap-3 text-center">
              <Award className="h-10 w-10 text-gold/30" />
              <p className="text-sm text-[var(--color-text-secondary)]">
                No certificates yet. Complete a course to earn one.
              </p>
            </div>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {certificates.map((cert, idx) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <GlassCard className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-gold/20 bg-gold/5">
                        <Award className="h-6 w-6 text-gold" />
                      </div>
                      <div>
                        <h3 className="font-display text-sm font-semibold text-[var(--color-text-primary)]">
                          {cert.course_title}
                        </h3>
                        <p className="text-xs text-[var(--color-text-muted)]">
                          {cert.student_name}
                        </p>
                      </div>
                    </div>
                    <span className="rounded-full border border-green-500/20 bg-green-500/5 px-2 py-0.5 text-[10px] font-medium text-green-400">
                      {cert.status}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2 border-t border-[var(--color-border-default)] pt-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[var(--color-text-muted)]">
                        Certificate #
                      </span>
                      <span className="font-mono text-[var(--color-text-secondary)]">
                        {cert.certificate_number}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[var(--color-text-muted)]">
                        Issued
                      </span>
                      <span className="text-[var(--color-text-secondary)]">
                        {new Date(cert.issued_at).toLocaleDateString()}
                      </span>
                    </div>
                    {cert.teacher_name && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[var(--color-text-muted)]">
                          Instructor
                        </span>
                        <span className="text-[var(--color-text-secondary)]">
                          {cert.teacher_name}
                        </span>
                      </div>
                    )}
                  </div>

                  <button className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-gold/20 bg-gold/5 py-2 text-sm text-gold transition-colors hover:bg-gold/10">
                    <Download className="h-4 w-4" /> Download
                  </button>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Verify certificate */}
      <div>
        <h2 className="mb-4 font-display text-lg font-semibold text-[var(--color-text-primary)]">
          Verify a Certificate
        </h2>
        <GlassCard className="p-5" hover={false}>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={verifyNumber}
              onChange={(e) => setVerifyNumber(e.target.value)}
              placeholder="Enter certificate number"
              className="flex-1 rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-gold focus:outline-none"
            />
            <button
              onClick={handleVerify}
              disabled={!verifyNumber.trim() || verifying}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-gold px-4 py-2 text-sm font-medium text-black hover:bg-gold-hover disabled:opacity-50"
            >
              {verifying ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}{" "}
              Verify
            </button>
          </div>

          {verifyResult === "not_found" && (
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2 text-sm text-red-400">
              <ShieldCheck className="h-4 w-4" /> Certificate not found. Please
              check the number and try again.
            </div>
          )}

          {verifyResult && verifyResult !== "not_found" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 rounded-lg border border-green-500/20 bg-green-500/5 p-4"
            >
              <div className="flex items-center gap-2 text-sm font-medium text-green-400">
                <ShieldCheck className="h-4 w-4" /> Valid Certificate
              </div>
              <div className="mt-3 space-y-1.5 text-xs text-[var(--color-text-secondary)]">
                <p>
                  <span className="text-[var(--color-text-muted)]">
                    Student:
                  </span>{" "}
                  {verifyResult.student_name}
                </p>
                <p>
                  <span className="text-[var(--color-text-muted)]">
                    Course:
                  </span>{" "}
                  {verifyResult.course_title}
                </p>
                <p>
                  <span className="text-[var(--color-text-muted)]">
                    Issued:
                  </span>{" "}
                  {new Date(verifyResult.issued_at).toLocaleDateString()}
                </p>
                <p>
                  <span className="text-[var(--color-text-muted)]">
                    Certificate #:
                  </span>{" "}
                  <span className="font-mono">
                    {verifyResult.certificate_number}
                  </span>
                </p>
              </div>
            </motion.div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}

export default function CertificatesPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout title="Certificates">
        <CertificatesContent />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
