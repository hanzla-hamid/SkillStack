import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Inter, Sora, Noto_Nastaliq_Urdu } from "next/font/google";
import { BRAND, PROGRAMS } from "@/lib/constants";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { IntroProvider } from "@/components/providers/IntroProvider";
import { IntroExperience } from "@/components/intro/IntroExperience";
import {
  PremiumCursor,
  DynamicBackground,
  EasterEggs,
} from "@/components/shared";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

const notoUrdu = Noto_Nastaliq_Urdu({
  subsets: ["arabic"],
  variable: "--font-urdu",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const siteUrl = "https://skillstack.pk";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "SkillStack — From Learning to Earning | Premium Learning Academy",
    template: "%s | SkillStack",
  },
  description:
    "SkillStack is a premium hybrid learning academy in Rawalpindi, Pakistan. Master Web Development, Graphic Designing, Digital Marketing, and E-Commerce through project-based education. An Initiative of The Prudents.",
  keywords: [
    "SkillStack",
    "learning academy Rawalpindi",
    "web development institute Islamabad",
    "graphic designing course Pakistan",
    "digital marketing academy",
    "e-commerce course",
    "skill development Pakistan",
    "The Prudents",
    "Hanzla Hamid",
    "online learning platform",
    "physical academy Rawalpidi",
  ],
  authors: [{ name: "Hanzla Hamid" }],
  creator: "Hanzla Hamid",
  publisher: "The Prudents",
  openGraph: {
    title: "SkillStack — From Learning to Earning | Premium Learning Academy",
    description:
      "A premium hybrid learning academy in Rawalpindi, Pakistan. Master career-ready digital skills through project-based education.",
    type: "website",
    siteName: "SkillStack",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "SkillStack — From Learning to Earning",
    description:
      "A premium hybrid learning academy in Rawalpindi, Pakistan. Master career-ready digital skills.",
    creator: "@Skillstackpk",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/",
      "ur-PK": "/?lang=ur",
    },
  },
  category: "education",
};

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "SkillStack",
  description:
    "A premium hybrid learning academy in Rawalpindi, Pakistan. Master career-ready digital skills through project-based education.",
  url: siteUrl,
  email: BRAND.email,
  telephone: BRAND.phone1,
  address: {
    "@type": "PostalAddress",
    streetAddress: BRAND.address,
    addressLocality: "Rawalpindi",
    addressCountry: "PK",
  },
  sameAs: [
    BRAND.social.facebook,
    BRAND.social.instagram,
    BRAND.social.x,
    BRAND.social.youtube,
  ],
};

const itemListJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: PROGRAMS.filter((p) => p.status === "Available").map((p, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "Course",
      name: p.title,
      description: p.description,
      provider: {
        "@type": "EducationalOrganization",
        name: "SkillStack",
        sameAs: siteUrl,
      },
    },
  })),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${sora.variable} ${notoUrdu.variable} font-sans antialiased`}
      >
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
          <LanguageProvider>
            <AuthProvider>
              <IntroProvider>
                <IntroExperience />
                <PremiumCursor />
                <DynamicBackground />
                <EasterEggs />
                <script
                  type="application/ld+json"
                  dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
                />
                <script
                  type="application/ld+json"
                  dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
                />
                <main id="main-content" className="relative z-10">{children}</main>
              </IntroProvider>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
