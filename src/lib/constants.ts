import {
  Code2,
  Palette,
  Megaphone,
  ShoppingBag,
  FileCode,
  Video,
  BrainCircuit,
  Sheet,
  PenTool,
  Briefcase,
  Share2,
  Brush,
  Scissors,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export const BRAND = {
  name: "SkillStack",
  tagline: "From Learning to Earning.",
  subtitle: "Premium Learning Academy",
  organization: "An Initiative of The Prudents",
  developer: "Designed & Developed by Hanzla Hamid",
  email: "skillstack.pk.official@gmail.com",
  phone1: "+92 332 3131737",
  phone2: "+92 341 9293971",
  address: "H392+Q85, Rawalpindi, Pakistan",
  social: {
    facebook: "https://www.facebook.com/profile.php?id=61591636781863",
    instagram: "https://www.instagram.com/skillstack.pk.official/",
    x: "https://x.com/Skillstackpk",
    youtube: "https://www.youtube.com/@Skillstack-h2x",
    discord: "https://discord.com/channels/@me",
    whatsapp: "https://chat.whatsapp.com/CBK98JEFqCt8VSq27J8OAI",
    email: "mailto:skillstack.pk.official@gmail.com",
  },
};

export interface NavLink {
  label: string;
  href: string;
}

export interface NavMegaItem {
  label: string;
  href: string;
  children?: { label: string; href: string; description: string }[];
}

export const NAV_LINKS: NavMegaItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Courses",
    href: "/courses",
    children: [
      {
        label: "Web Development",
        href: "/courses/web-development",
        description: "Full-stack development with modern frameworks",
      },
      {
        label: "Graphic Designing",
        href: "/courses/graphic-designing",
        description: "Visual storytelling and brand identity",
      },
      {
        label: "Digital Marketing",
        href: "/courses/digital-marketing",
        description: "SEO, social media, and paid campaigns",
      },
      {
        label: "E-Commerce",
        href: "/courses/e-commerce",
        description: "Build and scale online stores",
      },
    ],
  },
  { label: "Library", href: "/library" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export interface FooterLink {
  label: string;
  href: string;
}

export const FOOTER_COLUMNS: {
  title: string;
  links: FooterLink[];
}[] = [
  {
    title: "Quick Links",
    links: [
      { label: "Home", href: "/" },
      { label: "About Us", href: "/about" },
      { label: "Learning Journey", href: "/#journey" },
      { label: "Founding Learners", href: "/#founding-learners" },
      { label: "FAQ", href: "/#faq" },
    ],
  },
  {
    title: "Courses",
    links: [
      { label: "Web Development", href: "/courses/web-development" },
      { label: "Graphic Designing", href: "/courses/graphic-designing" },
      { label: "Digital Marketing", href: "/courses/digital-marketing" },
      { label: "E-Commerce", href: "/courses/e-commerce" },
    ],
  },
  {
    title: "Learning Library",
    links: [
      { label: "Python", href: "/library" },
      { label: "Video Editing", href: "/library" },
      { label: "AI Tools", href: "/library" },
      { label: "Freelancing", href: "/library" },
      { label: "Content Writing", href: "/library" },
    ],
  },
];

export interface Program {
  title: string;
  slug: string;
  description: string;
  duration: string;
  difficulty: string;
  projects: string;
  icon: LucideIcon;
  features: string[];
  curriculum: { module: string; topics: string[] }[];
  category: "Physical" | "Online";
  status: "Available" | "Coming Soon";
}

export const PROGRAMS: Program[] = [
  {
    title: "Web Development",
    slug: "web-development",
    description:
      "Master full-stack development with modern frameworks, real-world projects, and production-grade code.",
    duration: "6 Months",
    difficulty: "Intermediate",
    projects: "12+ Projects",
    icon: Code2,
    features: [
      "React & Next.js",
      "Node.js & APIs",
      "Database Design",
      "Deployment",
    ],
    curriculum: [
      {
        module: "Foundations",
        topics: ["HTML5 & CSS3", "JavaScript ES6+", "Git & Version Control"],
      },
      {
        module: "Frontend",
        topics: ["React Fundamentals", "Next.js & SSR", "Tailwind CSS"],
      },
      {
        module: "Backend",
        topics: ["Node.js & Express", "REST APIs", "PostgreSQL"],
      },
      {
        module: "Production",
        topics: ["Authentication", "Deployment", "Performance Optimization"],
      },
    ],
    category: "Physical",
    status: "Available",
  },
  {
    title: "Graphic Designing",
    slug: "graphic-designing",
    description:
      "Learn visual storytelling, brand identity, and digital design using industry-standard tools.",
    duration: "4 Months",
    difficulty: "Beginner to Advanced",
    projects: "10+ Projects",
    icon: Palette,
    features: [
      "Adobe Suite",
      "Brand Identity",
      "UI/UX Design",
      "Portfolio Building",
    ],
    curriculum: [
      {
        module: "Design Principles",
        topics: ["Color Theory", "Typography", "Composition"],
      },
      {
        module: "Tools Mastery",
        topics: ["Photoshop", "Illustrator", "InDesign"],
      },
      {
        module: "Brand Design",
        topics: ["Logo Design", "Brand Guidelines", "Visual Identity"],
      },
      {
        module: "Portfolio",
        topics: ["Case Studies", "Presentation", "Client Pitching"],
      },
    ],
    category: "Physical",
    status: "Available",
  },
  {
    title: "Digital Marketing",
    slug: "digital-marketing",
    description:
      "Drive growth with SEO, social media strategy, paid campaigns, and data-driven marketing.",
    duration: "3 Months",
    difficulty: "Beginner",
    projects: "8+ Projects",
    icon: Megaphone,
    features: [
      "SEO & Analytics",
      "Social Media Strategy",
      "Paid Advertising",
      "Content Marketing",
    ],
    curriculum: [
      {
        module: "Marketing Basics",
        topics: ["Market Research", "Consumer Behavior", "Brand Strategy"],
      },
      {
        module: "SEO & Content",
        topics: ["On-Page SEO", "Content Strategy", "Google Analytics"],
      },
      {
        module: "Paid Advertising",
        topics: ["Google Ads", "Meta Ads", "Campaign Optimization"],
      },
      {
        module: "Social Media",
        topics: [
          "Strategy & Planning",
          "Community Management",
          "Influencer Marketing",
        ],
      },
    ],
    category: "Physical",
    status: "Available",
  },
  {
    title: "E-Commerce",
    slug: "e-commerce",
    description:
      "Build, launch, and scale online stores with modern e-commerce platforms and conversion strategies.",
    duration: "3 Months",
    difficulty: "Beginner to Intermediate",
    projects: "6+ Projects",
    icon: ShoppingBag,
    features: [
      "Store Setup",
      "Payment Integration",
      "Conversion Optimization",
      "Logistics",
    ],
    curriculum: [
      {
        module: "E-Commerce Basics",
        topics: ["Platform Selection", "Store Setup", "Product Listing"],
      },
      {
        module: "Operations",
        topics: [
          "Payment Gateways",
          "Shipping & Logistics",
          "Inventory Management",
        ],
      },
      {
        module: "Marketing",
        topics: [
          "Product Photography",
          "Conversion Optimization",
          "Email Marketing",
        ],
      },
      {
        module: "Scaling",
        topics: [
          "Analytics & Reporting",
          "Customer Retention",
          "Growth Strategies",
        ],
      },
    ],
    category: "Physical",
    status: "Available",
  },
  {
    title: "Python",
    slug: "python",
    description:
      "Learn Python programming from fundamentals to advanced applications.",
    duration: "3 Months",
    difficulty: "Beginner to Intermediate",
    projects: "8+ Projects",
    icon: FileCode,
    features: [
      "Python Fundamentals",
      "Data Structures",
      "Automation",
      "Web Scraping",
    ],
    curriculum: [
      {
        module: "Basics",
        topics: ["Syntax & Variables", "Control Flow", "Functions"],
      },
      { module: "Intermediate", topics: ["OOP", "File Handling", "Modules"] },
      { module: "Advanced", topics: ["Web Scraping", "Automation", "APIs"] },
    ],
    category: "Online",
    status: "Coming Soon",
  },
  {
    title: "Video Editing",
    slug: "video-editing",
    description: "Professional video editing with Premiere Pro and CapCut.",
    duration: "2 Months",
    difficulty: "Beginner to Advanced",
    projects: "6+ Projects",
    icon: Video,
    features: ["Premiere Pro", "CapCut", "Color Grading", "Motion Graphics"],
    curriculum: [
      { module: "Basics", topics: ["Interface", "Cutting", "Transitions"] },
      { module: "Intermediate", topics: ["Color Grading", "Audio", "Effects"] },
      {
        module: "Advanced",
        topics: ["Motion Graphics", "Exporting", "Workflow"],
      },
    ],
    category: "Online",
    status: "Coming Soon",
  },
  {
    title: "UI/UX Design",
    slug: "ui-ux-design",
    description: "Design beautiful, user-centered digital experiences.",
    duration: "3 Months",
    difficulty: "Intermediate",
    projects: "8+ Projects",
    icon: Palette,
    features: ["Figma", "User Research", "Prototyping", "Design Systems"],
    curriculum: [
      {
        module: "Fundamentals",
        topics: ["Design Thinking", "User Research", "Wireframing"],
      },
      { module: "Tools", topics: ["Figma", "Prototyping", "Design Systems"] },
      {
        module: "Portfolio",
        topics: ["Case Studies", "Portfolio Design", "Presentation"],
      },
    ],
    category: "Online",
    status: "Coming Soon",
  },
  {
    title: "AI Tools",
    slug: "ai-tools",
    description: "Master AI tools and prompt engineering for productivity.",
    duration: "1 Month",
    difficulty: "Beginner",
    projects: "4+ Projects",
    icon: BrainCircuit,
    features: ["ChatGPT", "Midjourney", "Prompt Engineering", "AI Workflows"],
    curriculum: [
      {
        module: "AI Basics",
        topics: ["Understanding AI", "Prompt Engineering", "Use Cases"],
      },
      { module: "Tools", topics: ["ChatGPT", "Midjourney", "Other AI Tools"] },
      {
        module: "Workflows",
        topics: ["Automation", "Integration", "Best Practices"],
      },
    ],
    category: "Online",
    status: "Coming Soon",
  },
  {
    title: "Cyber Security",
    slug: "cyber-security",
    description: "Learn cybersecurity fundamentals and ethical hacking.",
    duration: "4 Months",
    difficulty: "Intermediate to Advanced",
    projects: "10+ Projects",
    icon: Sparkles,
    features: [
      "Network Security",
      "Ethical Hacking",
      "Penetration Testing",
      "Security Tools",
    ],
    curriculum: [
      {
        module: "Fundamentals",
        topics: ["Networking", "Security Principles", "Threats"],
      },
      { module: "Tools", topics: ["Kali Linux", "Nmap", "Metasploit"] },
      {
        module: "Practical",
        topics: [
          "Penetration Testing",
          "Security Auditing",
          "Incident Response",
        ],
      },
    ],
    category: "Online",
    status: "Coming Soon",
  },
];

export interface LearningResource {
  title: string;
  description: string;
  icon: LucideIcon;
  category: string;
}

export const LEARNING_LIBRARY: LearningResource[] = [
  {
    title: "Python",
    description: "Programming fundamentals to advanced",
    icon: FileCode,
    category: "Programming",
  },
  {
    title: "Video Editing",
    description: "Professional editing with Premiere Pro",
    icon: Video,
    category: "Creative",
  },
  {
    title: "Artificial Intelligence",
    description: "AI fundamentals and prompt engineering",
    icon: BrainCircuit,
    category: "Technology",
  },
  {
    title: "Excel",
    description: "Data analysis and automation",
    icon: Sheet,
    category: "Business",
  },
  {
    title: "Content Creation",
    description: "Content strategy and creation",
    icon: PenTool,
    category: "Creative",
  },
  {
    title: "Freelancing",
    description: "Build a freelance career from scratch",
    icon: Briefcase,
    category: "Career",
  },
  {
    title: "Social Media",
    description: "Grow and monetize your presence",
    icon: Share2,
    category: "Marketing",
  },
  {
    title: "Canva",
    description: "Quick design for non-designers",
    icon: Brush,
    category: "Creative",
  },
  {
    title: "CapCut",
    description: "Mobile video editing mastery",
    icon: Scissors,
    category: "Creative",
  },
  {
    title: "Prompt Engineering",
    description: "Master AI prompts for any task",
    icon: Sparkles,
    category: "Technology",
  },
];

export interface WhyChooseItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const WHY_CHOOSE_SKILLSTACK: WhyChooseItem[] = [
  {
    icon: Code2,
    title: "Project-Based Learning",
    description: "Learn by building real-world projects that matter.",
  },
  {
    icon: Briefcase,
    title: "Industry-Ready Skills",
    description: "Curriculum designed with industry demands in mind.",
  },
  {
    icon: BrainCircuit,
    title: "Professional Mentorship",
    description: "Learn from experienced industry professionals.",
  },
  {
    icon: Palette,
    title: "Portfolio Building",
    description: "Graduate with a professional portfolio of work.",
  },
  {
    icon: Video,
    title: "Physical Classes",
    description: "Attend in-person classes at our Rawalpindi academy.",
  },
  {
    icon: Share2,
    title: "Online Resources",
    description: "Access learning resources anytime, anywhere.",
  },
  {
    icon: Users,
    title: "Community Support",
    description: "Join a growing community of learners and professionals.",
  },
  {
    icon: Briefcase,
    title: "Future Career Guidance",
    description: "Get guidance on freelancing, jobs, and career growth.",
  },
];

import { Users } from "lucide-react";

export const STATS = [
  { label: "students", value: 0, suffix: "+" },
  { label: "programs", value: 4, suffix: "" },
  { label: "resources", value: 10, suffix: "+" },
  { label: "satisfaction", value: 100, suffix: "%" },
];

export const TESTIMONIALS: {
  name: string;
  role: string;
  course: string;
  rating: number;
  review: string;
}[] = [
  {
    name: "Ayesha Khan",
    role: "Frontend Developer",
    course: "Web Development",
    rating: 5,
    review:
      "SkillStack transformed my career. I went from knowing nothing about coding to landing a remote frontend developer job in just 6 months. The project-based learning approach made all the difference.",
  },
  {
    name: "Bilal Ahmed",
    role: "Freelance Designer",
    course: "Graphic Designing",
    rating: 5,
    review:
      "The graphic design program at SkillStack is incredible. I built a professional portfolio during the course and started getting freelance clients before I even graduated. The mentorship is top-notch.",
  },
  {
    name: "Fatima Riaz",
    role: "Digital Marketing Specialist",
    course: "Digital Marketing",
    rating: 5,
    review:
      "I came in with zero marketing knowledge and left with a complete understanding of SEO, social media strategy, and paid advertising. SkillStack gave me the skills and confidence to start my own agency.",
  },
  {
    name: "Hamza Tariq",
    role: "E-commerce Entrepreneur",
    course: "E-Commerce",
    rating: 5,
    review:
      "The e-commerce course covered everything from store setup to scaling. I launched my online store during the program and made my first sale within a week. The practical approach is unmatched.",
  },
  {
    name: "Zainab Malik",
    role: "UI/UX Designer",
    course: "Web Development",
    rating: 5,
    review:
      "What sets SkillStack apart is the community. The instructors genuinely care about your success and the peer network helped me land my first design role. The physical classes in Rawalpindi are a game-changer.",
  },
  {
    name: "Usman Sheikh",
    role: "Full-Stack Developer",
    course: "Web Development",
    rating: 5,
    review:
      "The curriculum is industry-relevant and constantly updated. I appreciated that we worked on real projects, not just tutorials. SkillStack bridged the gap between learning and earning for me.",
  },
];

export interface LearningProcessStep {
  step: number;
  title: string;
  description: string;
}

export const LEARNING_PROCESS: LearningProcessStep[] = [
  {
    step: 1,
    title: "Enroll",
    description: "Choose your course and join SkillStack academy.",
  },
  {
    step: 2,
    title: "Learn",
    description: "Attend physical classes or access online resources.",
  },
  {
    step: 3,
    title: "Practice",
    description: "Build real-world projects with mentor guidance.",
  },
  {
    step: 4,
    title: "Get Certified",
    description: "Earn a verifiable certificate upon completion.",
  },
  {
    step: 5,
    title: "Start Earning",
    description: "Use your skills to freelance or land a job.",
  },
];

export interface RoadmapItem {
  phase: string;
  title: string;
  description: string;
}

export const LEARNING_ROADMAP: RoadmapItem[] = [
  {
    phase: "Phase 1",
    title: "Foundations",
    description: "Build core knowledge with fundamentals and theory.",
  },
  {
    phase: "Phase 2",
    title: "Practical Skills",
    description: "Apply concepts through hands-on projects and exercises.",
  },
  {
    phase: "Phase 3",
    title: "Advanced Topics",
    description: "Master advanced techniques and industry tools.",
  },
  {
    phase: "Phase 4",
    title: "Portfolio & Career",
    description: "Build your portfolio and prepare for your career.",
  },
];

export interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

export const SUCCESS_TIMELINE: TimelineItem[] = [
  {
    year: "Day 1",
    title: "Join SkillStack",
    description: "Begin your journey as a founding learner.",
  },
  {
    year: "Month 1",
    title: "Master Fundamentals",
    description: "Build strong foundations in your chosen field.",
  },
  {
    year: "Month 3",
    title: "Build Projects",
    description: "Create real-world projects for your portfolio.",
  },
  {
    year: "Month 6",
    title: "Get Certified",
    description: "Earn your certificate and start earning.",
  },
];

export interface GalleryItem {
  title: string;
  category: string;
  image: string;
}

export const GALLERY_ITEMS: GalleryItem[] = [
  { title: "Academy Campus", category: "Academy", image: "" },
  { title: "Web Development Class", category: "Classes", image: "" },
  { title: "Design Workshop", category: "Workshops", image: "" },
  { title: "Student Projects", category: "Projects", image: "" },
  { title: "Community Event", category: "Events", image: "" },
  { title: "Study Session", category: "Academy", image: "" },
];

export interface FAQ {
  question: string;
  answer: string;
}

export const FAQS: FAQ[] = [
  {
    question: "What makes SkillStack different from other learning platforms?",
    answer:
      "SkillStack is a premium hybrid learning academy based in Rawalpindi. We combine physical classroom learning with online resources, project-based education, and professional mentorship to take you from learning to earning.",
  },
  {
    question: "Where is SkillStack located?",
    answer:
      "SkillStack is located at H392+Q85, Rawalpindi, Pakistan. We serve students of Rawalpindi and Islamabad while remaining globally accessible through our online resources.",
  },
  {
    question: "Do I need prior experience to enroll?",
    answer:
      "No. Our programs are designed for all levels. Each course starts with fundamentals and progressively builds to advanced concepts. Beginner-friendly tracks are available for every program.",
  },
  {
    question: "How long do the programs take to complete?",
    answer:
      "Program durations range from 3 to 6 months depending on the course. All programs include structured milestones and project-based learning.",
  },
  {
    question: "Will I receive a certificate after completion?",
    answer:
      "Yes. Every program includes a verifiable certificate of completion with a unique certificate ID and QR code for verification.",
  },
  {
    question: "How can I contact SkillStack?",
    answer:
      "You can reach us at skillstack.pk.official@gmail.com, or call us at +92 332 3131737 or +92 341 9293971. Visit our contact page for more options.",
  },
];
