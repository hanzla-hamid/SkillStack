"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  BookOpen,
  Loader2,
  Edit3,
  Trash2,
  X,
  Save,
  Layers,
  FileText,
  Users,
} from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { GlassCard } from "@/components/shared";
import { supabase, Course, Module, Lesson, Enrollment } from "@/lib/supabase";
import { useAuth } from "@/components/providers/AuthProvider";

function TeacherCoursesContent() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [lessons, setLessons] = useState<Record<string, Lesson[]>>({});
  const [enrollmentCounts, setEnrollmentCounts] = useState<
    Record<string, number>
  >({});

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [categoryType, setCategoryType] = useState("physical");
  const [difficulty, setDifficulty] = useState("beginner");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, [user]);

  const fetchCourses = async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from("courses")
      .select("*")
      .eq("teacher_id", user.id)
      .order("created_at", { ascending: false });
    setCourses((data as Course[]) || []);

    const counts: Record<string, number> = {};
    for (const course of (data as Course[]) || []) {
      const { count } = await supabase
        .from("enrollments")
        .select("*", { count: "exact", head: true })
        .eq("course_id", course.id);
      counts[course.id] = count || 0;
    }
    setEnrollmentCounts(counts);
    setLoading(false);
  };

  const openCreateModal = () => {
    setEditingCourse(null);
    setTitle("");
    setDescription("");
    setLongDescription("");
    setCategoryType("physical");
    setDifficulty("beginner");
    setDuration("");
    setPrice(0);
    setShowModal(true);
  };

  const openEditModal = (course: Course) => {
    setEditingCourse(course);
    setTitle(course.title);
    setDescription(course.description || "");
    setLongDescription(course.long_description || "");
    setCategoryType(course.category_type);
    setDifficulty(course.difficulty);
    setDuration(course.duration || "");
    setPrice(course.price);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!user || !title.trim()) return;
    setSaving(true);

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    if (editingCourse) {
      await supabase
        .from("courses")
        .update({
          title,
          description,
          long_description: longDescription,
          category_type: categoryType,
          difficulty,
          duration,
          price,
          slug,
        })
        .eq("id", editingCourse.id);
    } else {
      await supabase.from("courses").insert({
        title,
        description,
        long_description: longDescription,
        category_type: categoryType,
        difficulty,
        duration,
        price,
        slug,
        teacher_id: user.id,
        status: "draft",
      });
    }

    setSaving(false);
    setShowModal(false);
    fetchCourses();
  };

  const handleDelete = async (courseId: string) => {
    if (
      !confirm(
        "Delete this course? This will also delete all modules and lessons.",
      )
    )
      return;
    await supabase.from("courses").delete().eq("id", courseId);
    fetchCourses();
  };

  const openCourseDetail = async (course: Course) => {
    setSelectedCourse(course);
    const { data: moduleData } = await supabase
      .from("modules")
      .select("*")
      .eq("course_id", course.id)
      .order("sort_order", { ascending: true });
    setModules((moduleData as Module[]) || []);

    const lessonMap: Record<string, Lesson[]> = {};
    for (const mod of (moduleData as Module[]) || []) {
      const { data: lessonData } = await supabase
        .from("lessons")
        .select("*")
        .eq("module_id", mod.id)
        .order("sort_order", { ascending: true });
      lessonMap[mod.id] = (lessonData as Lesson[]) || [];
    }
    setLessons(lessonMap);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  if (selectedCourse) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <button
              onClick={() => setSelectedCourse(null)}
              className="mb-2 text-sm text-[var(--color-text-muted)] hover:text-gold"
            >
              ← Back to courses
            </button>
            <h2 className="font-display text-lg font-semibold text-[var(--color-text-primary)]">
              {selectedCourse.title}
            </h2>
          </div>
          <span
            className={`rounded-full border px-3 py-1 text-xs ${selectedCourse.status === "published" ? "border-green-500/20 bg-green-500/5 text-green-400" : "border-gold/20 bg-gold/5 text-gold"}`}
          >
            {selectedCourse.status}
          </span>
        </div>

        {modules.length === 0 ? (
          <GlassCard className="p-8" hover={false}>
            <div className="flex flex-col items-center gap-3 text-center">
              <Layers className="h-10 w-10 text-gold/30" />
              <p className="text-sm text-[var(--color-text-secondary)]">
                No modules yet. Add modules to structure your course content.
              </p>
            </div>
          </GlassCard>
        ) : (
          <div className="space-y-3">
            {modules.map((mod, mIdx) => (
              <GlassCard key={mod.id} className="p-4" hover={false}>
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-gold/20 bg-gold/5 text-xs font-bold text-gold">
                    {mIdx + 1}
                  </span>
                  <h3 className="font-display text-sm font-semibold text-[var(--color-text-primary)]">
                    {mod.title}
                  </h3>
                  <span className="ml-auto text-xs text-[var(--color-text-muted)]">
                    {lessons[mod.id]?.length || 0} lessons
                  </span>
                </div>
                <div className="mt-2 space-y-1 pl-9">
                  {(lessons[mod.id] || []).map((lesson, lIdx) => (
                    <div
                      key={lesson.id}
                      className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]"
                    >
                      <FileText className="h-3.5 w-3.5 text-gold/50" />
                      <span>
                        {lIdx + 1}. {lesson.title}
                      </span>
                      {lesson.is_preview && (
                        <span className="rounded-full border border-gold/20 bg-gold/5 px-1.5 py-0.5 text-[10px] text-gold">
                          Preview
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--color-text-secondary)]">
          {courses.length} course{courses.length !== 1 ? "s" : ""}
        </p>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 rounded-lg bg-gold px-4 py-2 text-sm font-medium text-black hover:bg-gold-hover"
        >
          <Plus className="h-4 w-4" /> New Course
        </button>
      </div>

      {courses.length === 0 ? (
        <GlassCard className="p-8" hover={false}>
          <div className="flex flex-col items-center gap-3 text-center">
            <BookOpen className="h-10 w-10 text-gold/30" />
            <p className="text-sm text-[var(--color-text-secondary)]">
              No courses yet. Create your first course to get started.
            </p>
          </div>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {courses.map((course, idx) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <GlassCard className="p-5">
                <div className="flex items-start justify-between">
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => openCourseDetail(course)}
                  >
                    <h3 className="font-display text-sm font-semibold text-[var(--color-text-primary)] hover:text-gold">
                      {course.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-xs text-[var(--color-text-secondary)]">
                      {course.description || "No description"}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-full border border-gold/20 bg-gold/5 px-2 py-0.5 text-[10px] capitalize text-gold">
                        {course.category_type}
                      </span>
                      <span className="rounded-full border border-[var(--color-border-default)] px-2 py-0.5 text-[10px] capitalize text-[var(--color-text-muted)]">
                        {course.difficulty}
                      </span>
                      <span className="flex items-center gap-1 rounded-full border border-[var(--color-border-default)] px-2 py-0.5 text-[10px] text-[var(--color-text-muted)]">
                        <Users className="h-3 w-3" />{" "}
                        {enrollmentCounts[course.id] || 0}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => openEditModal(course)}
                      className="rounded-lg p-1.5 text-[var(--color-text-muted)] hover:text-gold"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(course.id)}
                      className="rounded-lg p-1.5 text-[var(--color-text-muted)] hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create/Edit modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-surface)] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-[var(--color-text-primary)]">
                {editingCourse ? "Edit Course" : "New Course"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--color-text-secondary)]">
                  Title
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Course title"
                  className="w-full rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-gold focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--color-text-secondary)]">
                  Short Description
                </label>
                <input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short description"
                  className="w-full rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-gold focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--color-text-secondary)]">
                  Long Description
                </label>
                <textarea
                  value={longDescription}
                  onChange={(e) => setLongDescription(e.target.value)}
                  placeholder="Detailed description"
                  rows={3}
                  className="w-full rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-gold focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-[var(--color-text-secondary)]">
                    Category Type
                  </label>
                  <select
                    value={categoryType}
                    onChange={(e) => setCategoryType(e.target.value)}
                    className="w-full rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text-primary)] focus:border-gold focus:outline-none"
                  >
                    <option value="physical">Physical</option>
                    <option value="online">Online</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-[var(--color-text-secondary)]">
                    Difficulty
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text-primary)] focus:border-gold focus:outline-none"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-[var(--color-text-secondary)]">
                    Duration
                  </label>
                  <input
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g. 12 weeks"
                    className="w-full rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-gold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-[var(--color-text-secondary)]">
                    Price (Rs.)
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    min={0}
                    className="w-full rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text-primary)] focus:border-gold focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg border border-[var(--color-border-default)] px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !title.trim()}
                className="inline-flex items-center gap-1.5 rounded-lg bg-gold px-4 py-2 text-sm font-medium text-black hover:bg-gold-hover disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}{" "}
                {editingCourse ? "Update" : "Create"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default function TeacherCoursesPage() {
  return (
    <ProtectedRoute
      allowedRoles={["teacher", "moderator", "admin", "super_admin"]}
    >
      <DashboardLayout title="My Courses">
        <TeacherCoursesContent />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
