"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  Calendar,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Globe,
  XCircle,
} from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { CountrySelect } from "@/components/auth/CountrySelect";
import { PasswordStrength } from "@/components/auth/PasswordStrength";
import { supabase } from "@/lib/supabase";

type AvailabilityState = "idle" | "checking" | "available" | "taken";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    gender: "",
    dateOfBirth: "",
    city: "",
    country: "",
    acceptTerms: false,
    newsletter: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [usernameStatus, setUsernameStatus] = useState<AvailabilityState>("idle");
  const [emailStatus, setEmailStatus] = useState<AvailabilityState>("idle");

  const update = (key: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // Debounced username availability check
  const checkUsername = useCallback(async (username: string) => {
    if (username.length < 3) {
      setUsernameStatus("idle");
      return;
    }
    setUsernameStatus("checking");
    const { data, error: rpcError } = await supabase.rpc(
      "lookup_email_by_username",
      { p_username: username },
    );
    if (rpcError) {
      setUsernameStatus("idle");
      return;
    }
    setUsernameStatus(data ? "taken" : "available");
  }, []);

  // Debounced email availability check
  const checkEmail = useCallback(async (email: string) => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailStatus("idle");
      return;
    }
    setEmailStatus("checking");
    const { data } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", email)
      .maybeSingle();
    setEmailStatus(data ? "taken" : "available");
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      if (formData.username) checkUsername(formData.username);
      else setUsernameStatus("idle");
    }, 400);
    return () => clearTimeout(t);
  }, [formData.username, checkUsername]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (formData.email) checkEmail(formData.email);
      else setEmailStatus("idle");
    }, 400);
    return () => clearTimeout(t);
  }, [formData.email, checkEmail]);

  const validate = (): string | null => {
    if (!formData.fullName.trim()) return "Full name is required.";
    if (!formData.email.trim()) return "Email is required.";
    if (emailStatus === "taken") return "This email is already registered.";
    if (!formData.username.trim()) return "Username is required.";
    if (usernameStatus === "taken") return "This username is already taken.";
    if (formData.password.length < 8)
      return "Password must be at least 8 characters.";
    if (formData.password !== formData.confirmPassword)
      return "Passwords do not match.";
    if (!formData.city.trim()) return "City is required.";
    if (!formData.country.trim()) return "Country is required.";
    if (!formData.acceptTerms)
      return "You must accept the Terms and Conditions.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            username: formData.username,
            phone: formData.phone || null,
            gender: formData.gender || null,
            date_of_birth: formData.dateOfBirth || null,
            city: formData.city,
            country: formData.country,
            newsletter_opt_in: formData.newsletter,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        // The DB trigger handle_new_user auto-creates the profile row.
        // Also upsert as a safety net in case the trigger hasn't propagated yet.
        await supabase.from("profiles").upsert({
          id: data.user.id,
          email: formData.email,
          full_name: formData.fullName,
          username: formData.username,
          phone: formData.phone || null,
          gender: formData.gender || null,
          date_of_birth: formData.dateOfBirth || null,
          city: formData.city,
          country: formData.country,
          newsletter_opt_in: formData.newsletter,
        });
      }

      router.push("/verify-email");
      router.refresh();
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join SkillStack and start your journey"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <Field
          label="Full Name *"
          icon={<User className="h-4 w-4" />}
          type="text"
          value={formData.fullName}
          onChange={(v) => update("fullName", v)}
          placeholder="John Doe"
        />

        {/* Username with availability check */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--color-text-primary)]">
            Username *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
            <input
              type="text"
              value={formData.username}
              onChange={(e) => update("username", e.target.value.replace(/[^a-zA-Z0-9_]/g, ""))}
              placeholder="johndoe"
              required
              className="w-full rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface)] py-2.5 pl-10 pr-10 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] transition-colors focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <AvailabilityIndicator status={usernameStatus} />
            </div>
          </div>
          {usernameStatus === "available" && (
            <p className="mt-1 text-xs text-green-500">Username is available</p>
          )}
          {usernameStatus === "taken" && (
            <p className="mt-1 text-xs text-red-400">This username is already taken</p>
          )}
        </div>

        {/* Email with availability check */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--color-text-primary)]">
            Email Address *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface)] py-2.5 pl-10 pr-10 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] transition-colors focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <AvailabilityIndicator status={emailStatus} />
            </div>
          </div>
          {emailStatus === "available" && (
            <p className="mt-1 text-xs text-green-500">Email is available</p>
          )}
          {emailStatus === "taken" && (
            <p className="mt-1 text-xs text-red-400">This email is already registered</p>
          )}
        </div>

        {/* Phone */}
        <Field
          label="Phone Number"
          icon={<Phone className="h-4 w-4" />}
          type="tel"
          value={formData.phone}
          onChange={(v) => update("phone", v)}
          placeholder="+92 300 0000000"
        />

        {/* Password */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--color-text-primary)]">
            Password *
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
            <input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => update("password", e.target.value)}
              placeholder="At least 8 characters"
              required
              className="w-full rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface)] py-2.5 pl-10 pr-10 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] transition-colors focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] transition-colors hover:text-gold"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <PasswordStrength password={formData.password} />
        </div>

        {/* Confirm Password */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--color-text-primary)]">
            Confirm Password *
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) => update("confirmPassword", e.target.value)}
              placeholder="Re-enter password"
              required
              className="w-full rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface)] py-2.5 pl-10 pr-10 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] transition-colors focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] transition-colors hover:text-gold"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {formData.confirmPassword && formData.password !== formData.confirmPassword && (
            <p className="mt-1 text-xs text-red-400">Passwords do not match</p>
          )}
          {formData.confirmPassword && formData.password === formData.confirmPassword && (
            <p className="mt-1 flex items-center gap-1 text-xs text-green-500">
              <CheckCircle2 className="h-3 w-3" /> Passwords match
            </p>
          )}
        </div>

        {/* Gender + DOB */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--color-text-primary)]">
              Gender
            </label>
            <select
              value={formData.gender}
              onChange={(e) => update("gender", e.target.value)}
              className="w-full rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface)] px-3 py-2.5 text-sm text-[var(--color-text-primary)] transition-colors focus:border-gold/40 focus:outline-none"
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer-not-say">Prefer not to say</option>
            </select>
          </div>
          <Field
            label="Date of Birth"
            icon={<Calendar className="h-4 w-4" />}
            type="date"
            value={formData.dateOfBirth}
            onChange={(v) => update("dateOfBirth", v)}
            placeholder=""
          />
        </div>

        {/* City + Country */}
        <div className="grid grid-cols-2 gap-4">
          <Field
            label="City *"
            icon={<MapPin className="h-4 w-4" />}
            type="text"
            value={formData.city}
            onChange={(v) => update("city", v)}
            placeholder="Rawalpindi"
          />
          <CountrySelect
            value={formData.country}
            onChange={(v) => update("country", v)}
            required
          />
        </div>

        {/* Checkboxes */}
        <div className="space-y-3 pt-2">
          <label className="flex cursor-pointer items-start gap-2 text-sm text-[var(--color-text-secondary)]">
            <input
              type="checkbox"
              checked={formData.acceptTerms}
              onChange={(e) => update("acceptTerms", e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-[var(--color-border-default)] bg-[var(--color-surface)] accent-gold"
            />
            <span>
              I accept the{" "}
              <Link href="/terms" className="text-gold hover:text-gold-hover">
                Terms & Conditions
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-gold hover:text-gold-hover">
                Privacy Policy
              </Link>
            </span>
          </label>
          <label className="flex cursor-pointer items-start gap-2 text-sm text-[var(--color-text-secondary)]">
            <input
              type="checkbox"
              checked={formData.newsletter}
              onChange={(e) => update("newsletter", e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-[var(--color-border-default)] bg-[var(--color-surface)] accent-gold"
            />
            <span>
              Subscribe to newsletter for updates and offers (optional)
            </span>
          </label>
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
              Creating account...
            </>
          ) : (
            "Create Account"
          )}
        </button>

        <p className="text-center text-sm text-[var(--color-text-secondary)]">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-gold transition-colors hover:text-gold-hover"
          >
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

function AvailabilityIndicator({ status }: { status: AvailabilityState }) {
  if (status === "idle") return null;
  if (status === "checking")
    return <Loader2 className="h-4 w-4 animate-spin text-[var(--color-text-muted)]" />;
  if (status === "available")
    return <CheckCircle2 className="h-4 w-4 text-green-500" />;
  if (status === "taken")
    return <XCircle className="h-4 w-4 text-red-400" />;
  return null;
}

function Field({
  label,
  icon,
  type,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  icon: React.ReactNode;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-[var(--color-text-primary)]">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
          {icon}
        </span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={label.includes("*")}
          className="w-full rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface)] py-2.5 pl-10 pr-4 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] transition-colors focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20"
        />
      </div>
    </div>
  );
}
