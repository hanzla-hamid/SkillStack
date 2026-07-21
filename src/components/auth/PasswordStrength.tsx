"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

interface PasswordStrengthProps {
  password: string;
}

interface Requirement {
  label: string;
  test: (pw: string) => boolean;
}

const REQUIREMENTS: Requirement[] = [
  { label: "At least 8 characters", test: (pw) => pw.length >= 8 },
  { label: "Uppercase letter", test: (pw) => /[A-Z]/.test(pw) },
  { label: "Lowercase letter", test: (pw) => /[a-z]/.test(pw) },
  { label: "Number", test: (pw) => /\d/.test(pw) },
  { label: "Special character", test: (pw) => /[^A-Za-z0-9]/.test(pw) },
];

function calculateStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 1) return { score: 1, label: "Weak", color: "#ef4444" };
  if (score <= 2) return { score: 2, label: "Fair", color: "#f97316" };
  if (score <= 3) return { score: 3, label: "Good", color: "#eab308" };
  if (score <= 4) return { score: 4, label: "Strong", color: "#22c55e" };
  return { score: 5, label: "Very Strong", color: "#16a34a" };
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const strength = useMemo(() => calculateStrength(password), [password]);
  const metRequirements = useMemo(
    () => REQUIREMENTS.map((r) => ({ ...r, met: r.test(password) })),
    [password],
  );

  if (!password) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-2 space-y-2.5 overflow-hidden"
    >
      {/* Strength bar */}
      <div className="flex items-center gap-2">
        <div className="flex h-1.5 flex-1 gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex-1 rounded-full transition-colors duration-300"
              style={{
                backgroundColor: i <= strength.score ? strength.color : "var(--color-surface-card)",
              }}
            />
          ))}
        </div>
        <span className="text-xs font-medium" style={{ color: strength.color }}>
          {strength.label}
        </span>
      </div>

      {/* Requirements checklist */}
      <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
        {metRequirements.map((req) => (
          <div
            key={req.label}
            className="flex items-center gap-1.5 text-xs"
          >
            {req.met ? (
              <Check className="h-3 w-3 shrink-0 text-green-500" />
            ) : (
              <X className="h-3 w-3 shrink-0 text-[var(--color-text-muted)]" />
            )}
            <span className={req.met ? "text-[var(--color-text-secondary)]" : "text-[var(--color-text-muted)]"}>
              {req.label}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
