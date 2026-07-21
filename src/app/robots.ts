import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard/", "/admin/", "/teacher/", "/login", "/register", "/logout"],
    },
    sitemap: "https://skillstack.pk/sitemap.xml",
  };
}
