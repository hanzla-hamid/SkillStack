"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "ur";

interface LanguageContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
}

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined,
);

export const translations: Record<Language, Record<string, string>> = {
  en: {
    "nav.home": "Home",
    "nav.courses": "Courses",
    "nav.library": "Library",
    "nav.about": "About",
    "nav.contact": "Contact",
    "nav.enroll": "Enroll Now",

    "hero.badge": "Premium Learning Academy",
    "hero.title1": "Build Skills.",
    "hero.title2": "Build Your",
    "hero.title3": "Future.",
    "hero.tagline": "From Learning to Earning.",
    "hero.description":
      "A premium hybrid learning academy based in Rawalpindi. Master real-world skills through project-based education, professional mentorship, and industry-ready training.",
    "hero.startLearning": "Start Learning",
    "hero.exploreCourses": "Explore Courses",
    "hero.joinCommunity": "Join Community",
    "hero.bookVisit": "Book a Visit",
    "hero.students": "Growing Community",
    "hero.certificates": "Industry Certificates",
    "hero.resources": "Learning Resources",

    "courses.eyebrow": "Featured Courses",
    "courses.title": "Premium Programs for",
    "courses.highlight": "Career-Ready Skills",
    "courses.subtitle":
      "Industry-focused programs designed to take you from beginner to professional. Each track includes real-world projects, mentorship, and certification.",
    "courses.learnMore": "Learn More",
    "courses.enroll": "Enroll",
    "courses.duration": "Duration",
    "courses.difficulty": "Difficulty",
    "courses.projects": "Projects",
    "courses.physicalAcademy": "Physical Academy",
    "courses.onlineCourses": "Online Courses",
    "courses.available": "Available",
    "courses.comingSoon": "Coming Soon",

    "why.eyebrow": "Why SkillStack",
    "why.title": "Built for",
    "why.highlight": "Real Outcomes",
    "why.subtitle":
      "We don't just teach skills. We build careers. Every aspect of SkillStack is designed to take you from learning to earning.",

    "process.eyebrow": "Learning Process",
    "process.title": "How",
    "process.highlight": "SkillStack Works",
    "process.subtitle":
      "A structured five-step journey designed to take you from enrollment to a thriving career.",

    "physical.eyebrow": "Physical Academy",
    "physical.title": "Learn in Person at",
    "physical.highlight": "Rawalpindi",
    "physical.subtitle":
      "Attend physical classes at our academy in Rawalpindi. Get hands-on mentorship, collaborate with peers, and build in a professional environment.",

    "online.eyebrow": "Online Academy",
    "online.title": "Learn Anytime",
    "online.highlight": "Anywhere",
    "online.subtitle":
      "Access our growing library of online courses. Learn at your own pace with structured resources and community support.",

    "journey.eyebrow": "Student Journey",
    "journey.title": "Your Path from",
    "journey.highlight": "Learning to Earning",
    "journey.subtitle":
      "A structured five-step journey designed to take you from enrollment to a thriving career.",

    "roadmap.eyebrow": "Learning Roadmap",
    "roadmap.title": "Your Learning",
    "roadmap.highlight": "Roadmap",
    "roadmap.subtitle": "A clear path from foundations to career readiness.",

    "timeline.eyebrow": "Success Timeline",
    "timeline.title": "Your Journey to",
    "timeline.highlight": "Success",
    "timeline.subtitle": "From day one to earning with your new skills.",

    "video.eyebrow": "Promotional Video",
    "video.title": "See SkillStack",
    "video.highlight": "in Action",
    "video.subtitle":
      "Watch our academy, classes, and student projects. New course trailers coming soon.",
    "video.placeholder": "Video Coming Soon",

    "gallery.eyebrow": "Gallery Preview",
    "gallery.title": "Inside",
    "gallery.highlight": "SkillStack",
    "gallery.subtitle":
      "A glimpse into our academy, classes, workshops, and events.",
    "gallery.all": "All",
    "gallery.academy": "Academy",
    "gallery.classes": "Classes",
    "gallery.workshops": "Workshops",
    "gallery.projects": "Projects",
    "gallery.events": "Events",

    "founding.eyebrow": "Founding Learners",
    "founding.title": "Become One of SkillStack's",
    "founding.highlight": "Founding Learners",
    "founding.subtitle":
      "Be among the first generation of SkillStack learners. Your journey, achievements, and success will define what SkillStack becomes.",
    "founding.cta": "Join as a Founding Learner",
    "founding.whatsapp": "Join WhatsApp Community",

    "stats.students": "Growing Community",
    "stats.programs": "Premium Programs",
    "stats.resources": "Learning Resources",
    "stats.satisfaction": "Student Satisfaction",

    "library.eyebrow": "Free Learning Library",
    "library.title": "Curated Resources for",
    "library.highlight": "Self-Paced Learning",
    "library.subtitle":
      "Explore our free collection of curated learning resources. Start learning today with no commitment required.",
    "library.free": "All resources are 100% free. No sign-up required.",

    "faq.eyebrow": "FAQ",
    "faq.title": "Frequently Asked",
    "faq.highlight": "Questions",
    "faq.subtitle":
      "Everything you need to know about SkillStack programs, enrollment, and certification.",

    "cta.badge": "Start Today",
    "cta.title": "Ready to Build Your",
    "cta.highlight": "Future?",
    "cta.description":
      "Join SkillStack today and start your journey from learning to earning. Enroll now and become part of a growing community of learners.",
    "cta.enroll": "Enroll Now",
    "cta.explore": "Explore Courses",

    "footer.tagline": "From Learning to Earning.",
    "footer.description":
      "A premium hybrid learning academy based in Rawalpindi, serving students of Rawalpindi and Islamabad.",
    "footer.quickLinks": "Quick Links",
    "footer.courses": "Courses",
    "footer.library": "Learning Library",
    "footer.contact": "Contact",
    "footer.rights": "All rights reserved.",
    "footer.organization": "An Initiative of The Prudents",
    "footer.developer": "Designed & Developed by Hanzla Hamid",
  },
  ur: {
    "nav.home": "صفحہ اول",
    "nav.courses": "کورسز",
    "nav.library": "لائبریری",
    "nav.about": "ہمارے بارے میں",
    "nav.contact": "رابطہ",
    "nav.enroll": "ابھی داخلہ لیں",

    "hero.badge": "پریمیم لرننگ اکیڈمی",
    "hero.title1": "مہارت building.",
    "hero.title2": "اپنا",
    "hero.title3": "مستقبل.",
    "hero.tagline": "سیکھنے سے کمانے تک۔",
    "hero.description":
      "راولپنڈی میں واقع ایک پریمیم ہائبرڈ لرننگ اکیڈمی۔ حقیقی منصوبے بنائیں، پیشہ ور ماہرین سے سیکھیں، اور صنعت کے لیے تیار ہوں۔",
    "hero.startLearning": "سیکھنا شروع کریں",
    "hero.exploreCourses": "کورسز دیکھیں",
    "hero.joinCommunity": "کمیونٹی میں شامل ہوں",
    "hero.bookVisit": "وزٹ بک کریں",
    "hero.students": "گرونگ کمیونٹی",
    "hero.certificates": "انڈسٹری سرٹیفکیٹس",
    "hero.resources": "تعلیمی وسائل",

    "courses.eyebrow": "نمایاں کورسز",
    "courses.title": "پریمیم پروگرام برائے",
    "courses.highlight": "کیریئر کے لیے تیار مہارتیں",
    "courses.subtitle":
      "صنعت پر مبنی پروگرام جو آپ کو مبتدی سے پیشہ ور تک لے جانے کے لیے بنائے گئے ہیں۔",
    "courses.learnMore": "مزید جانیں",
    "courses.enroll": "داخلہ لیں",
    "courses.duration": "دورانیہ",
    "courses.difficulty": "مشکل",
    "courses.projects": "منصوبے",
    "courses.physicalAcademy": "فزیکل اکیڈمی",
    "courses.onlineCourses": "آن لائن کورسز",
    "courses.available": "دستیاب",
    "courses.comingSoon": "جلد آرہا ہے",

    "why.eyebrow": "اسکل اسٹیک کیوں",
    "why.title": "بنا گیا",
    "why.highlight": "حقیقی نتائج کے لیے",
    "why.subtitle": "ہم صرف مہارتیں نہیں سکھاتے۔ ہم کیریئر بناتے ہیں۔",

    "process.eyebrow": "تعلیمی عمل",
    "process.title": "اسکل اسٹیک",
    "process.highlight": "کیسے کام کرتا ہے",
    "process.subtitle":
      "پانچ مراحل کا منظم سفر جو آپ کو داخلے سے کامیاب کیریئر تک لے جاتا ہے۔",

    "physical.eyebrow": "فزیکل اکیڈمی",
    "physical.title": "راولپنڈی میں",
    "physical.highlight": "حضوری سیکھیں",
    "physical.subtitle":
      "ہماری اکیڈمی میں فزیکل کلاسز میں شامل ہوں۔ عملی رہنمائی حاصل کریں اور پیشہ ورانہ ماحول میں بنائیں۔",

    "online.eyebrow": "آن لائن اکیڈمی",
    "online.title": "کبھی بھی،",
    "online.highlight": "کہیں بھی سیکھیں",
    "online.subtitle":
      "ہماری بڑھتی ہوئی آن لائن کورسز کی لائبریری تک رسائی حاصل کریں۔",

    "journey.eyebrow": "طالب علم کا سفر",
    "journey.title": "آپ کا راستہ",
    "journey.highlight": "سیکھنے سے کمانے تک",
    "journey.subtitle":
      "پانچ مراحل کا منظم سفر جو آپ کو داخلے سے کامیاب کیریئر تک لے جاتا ہے۔",

    "roadmap.eyebrow": "تعلیمی روڈ میپ",
    "roadmap.title": "آپ کا تعلیمی",
    "roadmap.highlight": "روڈ میپ",
    "roadmap.subtitle": "بنیادوں سے کیریئر کی تیاری تک ایک واضح راستہ۔",

    "timeline.eyebrow": "کامیابی کا وقت خط",
    "timeline.title": "آپ کا سفر",
    "timeline.highlight": "کامیابی تک",
    "timeline.subtitle": "پہلے دن سے اپنی نئی مہارتوں سے کمانے تک۔",

    "video.eyebrow": "پروموشنل ویڈیو",
    "video.title": "اسکل اسٹیک",
    "video.highlight": "عمل میں دیکھیں",
    "video.subtitle": "ہماری اکیڈمی، کلاسز، اور طلباء کے منصوبے دیکھیں۔",
    "video.placeholder": "ویڈیو جلد آرہی ہے",

    "gallery.eyebrow": "گیلری پیش نظارہ",
    "gallery.title": "اسکل اسٹیک",
    "gallery.highlight": "کے اندر",
    "gallery.subtitle": "ہماری اکیڈمی، کلاسز، ورکشاپس، اور تقریبات کی جھلک۔",
    "gallery.all": "تمام",
    "gallery.academy": "اکیڈمی",
    "gallery.classes": "کلاسز",
    "gallery.workshops": "ورکشاپس",
    "gallery.projects": "منصوبے",
    "gallery.events": "تقریبات",

    "founding.eyebrow": "بانی طلباء",
    "founding.title": "اسکل اسٹیک کے",
    "founding.highlight": "بانی طلباء بنیں",
    "founding.subtitle": "اسکل اسٹیک کی پہلی نسل کے طلباء میں شامل ہوں۔",
    "founding.cta": "بانی طالب علم کے طور پر شامل ہوں",
    "founding.whatsapp": "واٹس ایپ کمیونٹی میں شامل ہوں",

    "stats.students": "گرونگ کمیونٹی",
    "stats.programs": "پریمیم پروگرام",
    "stats.resources": "تعلیمی وسائل",
    "stats.satisfaction": "طلباء کی اطمینان",

    "library.eyebrow": "مفت لرننگ لائبریری",
    "library.title": "منتخب وسائل برائے",
    "library.highlight": "خود رفتہ تعلیم",
    "library.subtitle":
      "ہماری مفت لرننگ لائبریری میں منتخب تعلیمی وسائل دریافت کریں۔",
    "library.free": "تمام وسائل 100% مفت ہیں۔ کوئی رجسٹریشن نہیں۔",

    "faq.eyebrow": "عمومی سوالات",
    "faq.title": "اکثر پوچھے جانے والے",
    "faq.highlight": "سوالات",
    "faq.subtitle":
      "اسکل اسٹیک پروگرام، داخلہ، اور سرٹیفکیشن کے بارے میں سب کچھ۔",

    "cta.badge": "آج ہی شروع کریں",
    "cta.title": "اپنا",
    "cta.highlight": "مستقبل بنانے کے لیے تیار؟",
    "cta.description":
      "آج ہی اسکل اسٹیک میں شامل ہوں اور سیکھنے سے کمانے کا سفر شروع کریں۔",
    "cta.enroll": "ابھی داخلہ لیں",
    "cta.explore": "کورسز دیکھیں",

    "footer.tagline": "سیکھنے سے کمانے تک۔",
    "footer.description": "راولپنڈی میں واقع ایک پریمیم ہائبرڈ لرننگ اکیڈمی۔",
    "footer.quickLinks": "فوری لنکس",
    "footer.courses": "کورسز",
    "footer.library": "لرننگ لائبریری",
    "footer.contact": "رابطہ",
    "footer.rights": "جملہ حقوق محفوظ ہیں۔",
    "footer.organization": "دی پروڈنٹس کی ایک پہل",
    "footer.developer": "ڈیزائن اینڈ ڈویلپڈ بائی ہانزلہ حمید",
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("skillstack-lang") as Language | null;
    if (saved === "en" || saved === "ur") {
      setLangState(saved);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ur" ? "rtl" : "ltr";
  }, [lang]);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("skillstack-lang", newLang);
  };

  const toggleLang = () => setLang(lang === "en" ? "ur" : "en");

  const t = (key: string): string => {
    return translations[lang][key] ?? translations.en[key] ?? key;
  };

  return (
    <LanguageContext.Provider
      value={{
        lang,
        setLang,
        toggleLang,
        t,
        dir: lang === "ur" ? "rtl" : "ltr",
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
