"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Upload,
  CheckCircle2,
  Clock,
  Loader2,
  Award,
  AlertCircle,
  X,
  Star,
  MessageSquare,
} from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { GlassCard } from "@/components/shared";
import { supabase, Assignment, Submission, Course } from "@/lib/supabase";
import { useAuth } from "@/components/providers/AuthProvider";

interface AssignmentWithCourse extends Assignment {
  course?: Course;
}

function AssignmentsContent() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<AssignmentWithCourse[]>([]);
  const [submissions, setSubmissions] = useState<Record<string, Submission>>(
    {},
  );
  const [loading, setLoading] = useState(true);
  const [submittingFor, setSubmittingFor] = useState<string | null>(null);
  const [submissionText, setSubmissionText] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchAssignments();
  }, [user]);

  const fetchAssignments = async () => {
    if (!user) return;
    setLoading(true);

    const { data: enrollments } = await supabase
      .from("enrollments")
      .select("course_id")
      .eq("user_id", user.id);

    if (!enrollments || enrollments.length === 0) {
      setLoading(false);
      return;
    }

    const courseIds = enrollments.map((e) => e.course_id);

    const { data: assignmentData } = await supabase
      .from("assignments")
      .select("*")
      .in("course_id", courseIds)
      .order("created_at", { ascending: false });

    if (!assignmentData) {
      setLoading(false);
      return;
    }

    const { data: courseData } = await supabase
      .from("courses")
      .select("*")
      .in("id", courseIds);

    const courseMap: Record<string, Course> = {};
    (courseData || []).forEach((c) => {
      courseMap[c.id] = c as Course;
    });

    const enriched = (assignmentData as Assignment[]).map((a) => ({
      ...a,
      course: courseMap[a.course_id],
    }));
    setAssignments(enriched);

    const { data: submissionData } = await supabase
      .from("submissions")
      .select("*")
      .eq("user_id", user.id);

    const subMap: Record<string, Submission> = {};
    (submissionData as Submission[]).forEach((s) => {
      subMap[s.assignment_id] = s;
    });
    setSubmissions(subMap);

    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!user || !submittingFor) return;
    const assignment = assignments.find((a) => a.id === submittingFor);
    if (!assignment) return;

    const { error } = await supabase.from("submissions").insert({
      assignment_id: assignment.id,
      user_id: user.id,
      content: submissionText,
      status: "submitted",
      submitted_at: new Date().toISOString(),
    });

    if (!error) {
      await fetchAssignments();
      setShowModal(false);
      setSubmissionText("");
      setSubmittingFor(null);
    }
  };

  const openSubmitModal = (assignmentId: string) => {
    setSubmittingFor(assignmentId);
    setSubmissionText("");
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  if (assignments.length === 0) {
    return (
      <GlassCard className="p-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <FileText className="h-10 w-10 text-gold/30" />
          <p className="text-sm text-[var(--color-text-secondary)]">
            No assignments yet. Enroll in a course to see assignments here.
          </p>
        </div>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-4">
      {assignments.map((assignment, idx) => {
        const submission = submissions[assignment.id];
        const isGraded = submission && submission.status === "graded";
        const isSubmitted = submission && submission.status === "submitted";

        return (
          <motion.div
            key={assignment.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <GlassCard className="p-5" hover={false}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-gold/20 bg-gold/5">
                      <FileText className="h-4 w-4 text-gold" />
                    </span>
                    <div>
                      <h3 className="font-display text-sm font-semibold text-[var(--color-text-primary)]">
                        {assignment.title}
                      </h3>
                      <p className="text-xs text-[var(--color-text-muted)]">
                        {assignment.course?.title || "Unknown course"}
                      </p>
                    </div>
                  </div>

                  {assignment.description && (
                    <p className="mt-3 text-sm text-[var(--color-text-secondary)]">
                      {assignment.description}
                    </p>
                  )}

                  <div className="mt-3 flex flex-wrap gap-3">
                    <span className="flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
                      <Award className="h-3.5 w-3.5" /> Max score:{" "}
                      {assignment.max_score}
                    </span>
                    {assignment.due_date && (
                      <span className="flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
                        <Clock className="h-3.5 w-3.5" /> Due:{" "}
                        {new Date(assignment.due_date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex-shrink-0">
                  {isGraded ? (
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-1.5 rounded-lg border border-green-500/20 bg-green-500/5 px-3 py-1.5 text-sm text-green-400">
                        <CheckCircle2 className="h-4 w-4" /> Graded
                      </div>
                      <p className="text-xs text-[var(--color-text-muted)]">
                        Score: {submission.score}/{assignment.max_score}
                      </p>
                      {submission.feedback && (
                        <p className="mt-1 max-w-xs rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface)] p-2 text-xs text-[var(--color-text-secondary)]">
                          <MessageSquare className="mb-1 h-3 w-3 text-gold" />{" "}
                          {submission.feedback}
                        </p>
                      )}
                    </div>
                  ) : isSubmitted ? (
                    <div className="flex items-center gap-1.5 rounded-lg border border-gold/20 bg-gold/5 px-3 py-1.5 text-sm text-gold">
                      <Clock className="h-4 w-4" /> Awaiting grading
                    </div>
                  ) : (
                    <button
                      onClick={() => openSubmitModal(assignment.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-gold px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-gold-hover"
                    >
                      <Upload className="h-4 w-4" /> Submit
                    </button>
                  )}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        );
      })}

      {/* Submit modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-surface)] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-[var(--color-text-primary)]">
                Submit Assignment
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <textarea
              value={submissionText}
              onChange={(e) => setSubmissionText(e.target.value)}
              placeholder="Write your submission here..."
              rows={6}
              className="w-full rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg)] p-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-gold focus:outline-none"
            />
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg border border-[var(--color-border-default)] px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!submissionText.trim()}
                className="inline-flex items-center gap-1.5 rounded-lg bg-gold px-4 py-2 text-sm font-medium text-black hover:bg-gold-hover disabled:opacity-50"
              >
                <Upload className="h-4 w-4" /> Submit
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default function AssignmentsPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout title="Assignments">
        <AssignmentsContent />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
