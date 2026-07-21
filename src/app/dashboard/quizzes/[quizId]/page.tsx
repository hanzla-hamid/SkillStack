"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  Award,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { GlassCard } from "@/components/shared";
import { supabase, Quiz, QuizQuestion, QuizAttempt } from "@/lib/supabase";
import { useAuth } from "@/components/providers/AuthProvider";

function QuizContent() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const quizId = params.quizId as string;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<QuizAttempt | null>(null);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);

  useEffect(() => {
    fetchQuiz();
  }, [quizId]);

  const fetchQuiz = async () => {
    setLoading(true);
    const { data: quizData } = await supabase
      .from("quizzes")
      .select("*")
      .eq("id", quizId)
      .maybeSingle();
    setQuiz(quizData as Quiz);

    const { data: questionData } = await supabase
      .from("quiz_questions")
      .select("*")
      .eq("quiz_id", quizId)
      .order("sort_order", { ascending: true });
    setQuestions((questionData as QuizQuestion[]) || []);

    if (user) {
      const { data: attemptData } = await supabase
        .from("quiz_attempts")
        .select("*")
        .eq("quiz_id", quizId)
        .eq("user_id", user.id)
        .order("started_at", { ascending: false });
      setAttempts((attemptData as QuizAttempt[]) || []);
    }

    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!user || !quiz) return;
    setSubmitting(true);

    let correctCount = 0;
    questions.forEach((q) => {
      if (q.question_type === "multiple_choice" && q.correct_answer) {
        if (answers[q.id] === q.correct_answer) correctCount++;
      } else if (q.question_type === "multiple_select" && q.correct_answers) {
        const selected = answers[q.id]?.split(",") || [];
        const correct = q.correct_answers;
        if (
          selected.length === correct.length &&
          selected.every((s) => correct.includes(s))
        )
          correctCount++;
      }
    });

    const score = Math.round((correctCount / questions.length) * 100);
    const passed = score >= quiz.passing_score;

    const { data } = await supabase
      .from("quiz_attempts")
      .insert({
        quiz_id: quiz.id,
        user_id: user.id,
        answers,
        score,
        passed,
        started_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (data) setResult(data as QuizAttempt);
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  if (!quiz) {
    return (
      <GlassCard className="p-8" hover={false}>
        <p className="text-center text-sm text-[var(--color-text-secondary)]">
          Quiz not found.
        </p>
      </GlassCard>
    );
  }

  if (result) {
    return (
      <div className="mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <GlassCard className="p-8 text-center" hover={false}>
            <div
              className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${result.passed ? "border border-green-500/20 bg-green-500/5" : "border border-red-500/20 bg-red-500/5"}`}
            >
              {result.passed ? (
                <CheckCircle2 className="h-8 w-8 text-green-400" />
              ) : (
                <XCircle className="h-8 w-8 text-red-400" />
              )}
            </div>
            <h2 className="mt-4 font-display text-2xl font-bold text-[var(--color-text-primary)]">
              {result.passed ? "Passed!" : "Not Passed"}
            </h2>
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              {quiz.title}
            </p>

            <div className="mt-6 flex items-center justify-center gap-8">
              <div>
                <p className="font-display text-3xl font-bold text-gold">
                  {result.score}%
                </p>
                <p className="text-xs text-[var(--color-text-muted)]">
                  Your Score
                </p>
              </div>
              <div className="h-12 w-px bg-[var(--color-border-default)]" />
              <div>
                <p className="font-display text-3xl font-bold text-[var(--color-text-secondary)]">
                  {quiz.passing_score}%
                </p>
                <p className="text-xs text-[var(--color-text-muted)]">
                  Passing Score
                </p>
              </div>
            </div>

            <button
              onClick={() => router.push("/dashboard")}
              className="mt-6 inline-flex items-center gap-1.5 rounded-lg bg-gold px-6 py-2.5 text-sm font-medium text-black hover:bg-gold-hover"
            >
              Back to Dashboard <ArrowRight className="h-4 w-4" />
            </button>
          </GlassCard>
        </motion.div>
      </div>
    );
  }

  if (
    quiz.max_attempts > 0 &&
    attempts.filter((a) => a.completed_at).length >= quiz.max_attempts
  ) {
    return (
      <GlassCard className="p-8" hover={false}>
        <div className="flex flex-col items-center gap-3 text-center">
          <AlertCircle className="h-10 w-10 text-gold/50" />
          <p className="text-sm text-[var(--color-text-secondary)]">
            You have reached the maximum number of attempts for this quiz.
          </p>
        </div>
      </GlassCard>
    );
  }

  const question = questions[currentQuestion];
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="mx-auto max-w-3xl">
      {/* Progress bar */}
      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between text-xs text-[var(--color-text-muted)]">
          <span>
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <span>
            {answeredCount}/{questions.length} answered
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-[var(--color-surface)]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-gold to-gold-light transition-all duration-300"
            style={{
              width: `${((currentQuestion + 1) / questions.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {quiz.time_limit_minutes && (
        <div className="mb-4 flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
          <Clock className="h-3.5 w-3.5" /> Time limit:{" "}
          {quiz.time_limit_minutes} minutes
        </div>
      )}

      {question && (
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <GlassCard className="p-6" hover={false}>
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-full border border-gold/20 bg-gold/5 px-2 py-0.5 text-[10px] font-medium capitalize text-gold">
                {question.question_type.replace("_", " ")}
              </span>
              <span className="text-xs text-[var(--color-text-muted)]">
                {question.points} points
              </span>
            </div>

            <h3 className="font-display text-lg font-semibold text-[var(--color-text-primary)]">
              {question.question}
            </h3>

            <div className="mt-4 space-y-2">
              {(question.options || []).map((option, optIdx) => {
                const isSelected =
                  question.question_type === "multiple_select"
                    ? (answers[question.id] || "").split(",").includes(option)
                    : answers[question.id] === option;

                return (
                  <button
                    key={optIdx}
                    onClick={() => {
                      if (question.question_type === "multiple_select") {
                        const current = (answers[question.id] || "")
                          .split(",")
                          .filter(Boolean);
                        const newAns = current.includes(option)
                          ? current.filter((a) => a !== option)
                          : [...current, option];
                        setAnswers({
                          ...answers,
                          [question.id]: newAns.join(","),
                        });
                      } else {
                        setAnswers({ ...answers, [question.id]: option });
                      }
                    }}
                    className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left text-sm transition-all ${
                      isSelected
                        ? "border-gold bg-gold/10 text-gold"
                        : "border-[var(--color-border-default)] text-[var(--color-text-secondary)] hover:border-gold/30 hover:bg-gold/5"
                    }`}
                  >
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full border text-xs ${
                        isSelected
                          ? "border-gold bg-gold text-black"
                          : "border-[var(--color-border-default)]"
                      }`}
                    >
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    {option}
                  </button>
                );
              })}
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Navigation */}
      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
          disabled={currentQuestion === 0}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-border-default)] px-4 py-2 text-sm text-[var(--color-text-secondary)] transition-colors hover:text-gold disabled:opacity-30"
        >
          <ArrowLeft className="h-4 w-4" /> Previous
        </button>

        {currentQuestion < questions.length - 1 ? (
          <button
            onClick={() => setCurrentQuestion(currentQuestion + 1)}
            disabled={!answers[question?.id]}
            className="inline-flex items-center gap-1.5 rounded-lg bg-gold px-4 py-2 text-sm font-medium text-black hover:bg-gold-hover disabled:opacity-50"
          >
            Next <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting || answeredCount < questions.length}
            className="inline-flex items-center gap-1.5 rounded-lg bg-gold px-6 py-2 text-sm font-medium text-black hover:bg-gold-hover disabled:opacity-50"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle2 className="h-4 w-4" />
            )}{" "}
            Submit Quiz
          </button>
        )}
      </div>
    </div>
  );
}

export default function QuizPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout title="Quiz">
        <QuizContent />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
