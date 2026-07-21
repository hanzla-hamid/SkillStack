"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Calendar,
  Save,
  Loader2,
  CheckCircle2,
  Camera,
  Lock,
  Eye,
  EyeOff,
  Bell,
  Shield,
} from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { GlassCard } from "@/components/shared";
import { useAuth } from "@/components/providers/AuthProvider";
import { supabase } from "@/lib/supabase";

function ProfileContent() {
  const { profile, user, refreshProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<
    "profile" | "security" | "notifications" | "privacy"
  >("profile");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    phone: "",
    bio: "",
    city: "",
    country: "",
    gender: "",
    date_of_birth: "",
  });
  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        username: profile.username || "",
        phone: profile.phone || "",
        bio: profile.bio || "",
        city: profile.city || "",
        country: profile.country || "",
        gender: profile.gender || "",
        date_of_birth: profile.date_of_birth || "",
      });
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    setSaving(true);
    setError("");

    try {
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          full_name: formData.full_name,
          username: formData.username,
          phone: formData.phone,
          bio: formData.bio,
          city: formData.city,
          country: formData.country,
          gender: formData.gender || null,
          date_of_birth: formData.date_of_birth || null,
        })
        .eq("id", user?.id);

      if (updateError) {
        setError(updateError.message);
        setSaving(false);
        return;
      }

      await refreshProfile();
      setSaved(true);
      setSaving(false);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Failed to update profile.");
      setSaving(false);
    }
  };

  const handleUpdatePassword = async () => {
    setSaving(true);
    setError("");

    if (passwordData.new.length < 8) {
      setError("Password must be at least 8 characters.");
      setSaving(false);
      return;
    }
    if (passwordData.new !== passwordData.confirm) {
      setError("Passwords do not match.");
      setSaving(false);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: passwordData.new,
    });

    if (updateError) {
      setError(updateError.message);
      setSaving(false);
      return;
    }

    setPasswordData({ current: "", new: "", confirm: "" });
    setSaved(true);
    setSaving(false);
    setTimeout(() => setSaved(false), 3000);
  };

  const tabs = [
    { id: "profile" as const, label: "Profile", icon: User },
    { id: "security" as const, label: "Security", icon: Lock },
    { id: "notifications" as const, label: "Notifications", icon: Bell },
    { id: "privacy" as const, label: "Privacy", icon: Shield },
  ];

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-gold/10 text-gold"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <GlassCard className="p-6">
            <div className="mb-6 flex items-center gap-4">
              <div className="relative">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border border-gold/20 bg-gold/10 text-2xl font-bold text-gold">
                  {profile?.full_name?.[0]?.toUpperCase() || "U"}
                </div>
                <button className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border border-[var(--color-border-default)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] transition-colors hover:text-gold">
                  <Camera className="h-3.5 w-3.5" />
                </button>
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-[var(--color-text-primary)]">
                  {profile?.full_name || "User"}
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  {profile?.email}
                </p>
                <span className="mt-1 inline-flex items-center gap-1 rounded-full border border-gold/20 bg-gold/5 px-2.5 py-0.5 text-xs text-gold capitalize">
                  {profile?.role || "student"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <ProfileField
                icon={User}
                label="Full Name"
                value={formData.full_name}
                onChange={(v) => setFormData({ ...formData, full_name: v })}
              />
              <ProfileField
                icon={User}
                label="Username"
                value={formData.username}
                onChange={(v) => setFormData({ ...formData, username: v })}
              />
              <ProfileField
                icon={Mail}
                label="Email"
                value={profile?.email || ""}
                onChange={() => {}}
                disabled
              />
              <ProfileField
                icon={Phone}
                label="Phone"
                value={formData.phone}
                onChange={(v) => setFormData({ ...formData, phone: v })}
              />
              <ProfileField
                icon={MapPin}
                label="City"
                value={formData.city}
                onChange={(v) => setFormData({ ...formData, city: v })}
              />
              <ProfileField
                icon={Globe}
                label="Country"
                value={formData.country}
                onChange={(v) => setFormData({ ...formData, country: v })}
              />
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[var(--color-text-primary)]">
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                  className="w-full rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface)] px-3 py-2.5 text-sm text-[var(--color-text-primary)] focus:border-gold/40 focus:outline-none"
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <ProfileField
                icon={Calendar}
                label="Date of Birth"
                type="date"
                value={formData.date_of_birth}
                onChange={(v) => setFormData({ ...formData, date_of_birth: v })}
              />
            </div>

            <div className="mt-4">
              <label className="mb-1.5 block text-sm font-medium text-[var(--color-text-primary)]">
                Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                rows={3}
                placeholder="Tell us about yourself..."
                className="w-full rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface)] px-3 py-2.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-gold/40 focus:outline-none"
              />
            </div>

            {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-lg bg-gold px-5 py-2.5 text-sm font-semibold text-black transition-all hover:bg-gold-hover hover:shadow-glow-sm disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save Changes
              </button>
              {saved && (
                <span className="flex items-center gap-1 text-sm text-green-400">
                  <CheckCircle2 className="h-4 w-4" />
                  Saved!
                </span>
              )}
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Security Tab */}
      {activeTab === "security" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <GlassCard className="p-6">
            <h3 className="mb-4 font-display text-lg font-semibold text-[var(--color-text-primary)]">
              Change Password
            </h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[var(--color-text-primary)]">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={passwordData.new}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, new: e.target.value })
                    }
                    placeholder="At least 8 characters"
                    className="w-full rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface)] py-2.5 pl-10 pr-10 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-gold/40 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-gold"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[var(--color-text-primary)]">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={passwordData.confirm}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirm: e.target.value,
                      })
                    }
                    placeholder="Re-enter password"
                    className="w-full rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface)] py-2.5 pl-10 pr-4 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-gold/40 focus:outline-none"
                  />
                </div>
              </div>
              {error && <p className="text-sm text-red-400">{error}</p>}
              <button
                onClick={handleUpdatePassword}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-lg bg-gold px-5 py-2.5 text-sm font-semibold text-black transition-all hover:bg-gold-hover hover:shadow-glow-sm disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Lock className="h-4 w-4" />
                )}
                Update Password
              </button>
              {saved && (
                <span className="ml-3 flex items-center gap-1 text-sm text-green-400">
                  <CheckCircle2 className="h-4 w-4" /> Password updated!
                </span>
              )}
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <GlassCard className="p-6">
            <h3 className="mb-4 font-display text-lg font-semibold text-[var(--color-text-primary)]">
              Notification Preferences
            </h3>
            <div className="space-y-4">
              {[
                {
                  label: "Course Updates",
                  desc: "Get notified about new lessons and course updates",
                },
                {
                  label: "Assignment Deadlines",
                  desc: "Reminders for upcoming assignment deadlines",
                },
                {
                  label: "Certificate Ready",
                  desc: "When a certificate is ready for download",
                },
                {
                  label: "Community Activity",
                  desc: "Replies and mentions from the community",
                },
                {
                  label: "Newsletter",
                  desc: "Monthly newsletter with updates and offers",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between border-b border-[var(--color-border-default)] pb-3"
                >
                  <div>
                    <p className="text-sm font-medium text-[var(--color-text-primary)]">
                      {item.label}
                    </p>
                    <p className="text-xs text-[var(--color-text-secondary)]">
                      {item.desc}
                    </p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="peer sr-only"
                    />
                    <div className="h-6 w-11 rounded-full bg-[var(--color-surface)] peer-checked:bg-gold/30 transition-colors" />
                    <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-[var(--color-border-default)] peer-checked:bg-gold peer-checked:translate-x-5 transition-all" />
                  </label>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Privacy Tab */}
      {activeTab === "privacy" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <GlassCard className="p-6">
            <h3 className="mb-4 font-display text-lg font-semibold text-[var(--color-text-primary)]">
              Privacy Settings
            </h3>
            <div className="space-y-4">
              {[
                {
                  label: "Public Profile",
                  desc: "Allow others to view your profile",
                },
                {
                  label: "Show on Leaderboard",
                  desc: "Display your name on public leaderboards",
                },
                {
                  label: "Show Progress",
                  desc: "Allow others to see your course progress",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between border-b border-[var(--color-border-default)] pb-3"
                >
                  <div>
                    <p className="text-sm font-medium text-[var(--color-text-primary)]">
                      {item.label}
                    </p>
                    <p className="text-xs text-[var(--color-text-secondary)]">
                      {item.desc}
                    </p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="peer sr-only"
                    />
                    <div className="h-6 w-11 rounded-full bg-[var(--color-surface)] peer-checked:bg-gold/30 transition-colors" />
                    <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-[var(--color-border-default)] peer-checked:bg-gold peer-checked:translate-x-5 transition-all" />
                  </label>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      )}
    </div>
  );
}

function ProfileField({
  icon,
  label,
  value,
  onChange,
  type = "text",
  disabled = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-[var(--color-text-primary)]">
        {label}
      </label>
      <div className="relative">
        {React.createElement(icon, {
          className:
            "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]",
        })}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="w-full rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface)] py-2.5 pl-10 pr-4 text-sm text-[var(--color-text-primary)] focus:border-gold/40 focus:outline-none disabled:opacity-50"
        />
      </div>
    </div>
  );
}

import React from "react";

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <DashboardLayout title="Profile & Settings">
        <ProfileContent />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
