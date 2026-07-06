import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const BASE_URL = "https://smacom.co.ke";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/about", changefreq: "monthly", priority: "0.9" },
          { path: "/solutions", changefreq: "monthly", priority: "0.9" },
          { path: "/services", changefreq: "monthly", priority: "0.8" },
          { path: "/technology", changefreq: "monthly", priority: "0.8" },
          { path: "/marketplace", changefreq: "weekly", priority: "0.8" },
          { path: "/learning", changefreq: "monthly", priority: "0.8" },
          { path: "/projects", changefreq: "monthly", priority: "0.7" },
          { path: "/impact", changefreq: "monthly", priority: "0.7" },
          { path: "/news", changefreq: "weekly", priority: "0.7" },
          { path: "/contact", changefreq: "yearly", priority: "0.7" },
          { path: "/login", changefreq: "monthly", priority: "0.6" },
          { path: "/register", changefreq: "monthly", priority: "0.6" },
          { path: "/forgot-password", changefreq: "yearly", priority: "0.4" },
          { path: "/reset-password", changefreq: "yearly", priority: "0.4" },
          { path: "/onboarding", changefreq: "monthly", priority: "0.6" },
          { path: "/dashboard", changefreq: "weekly", priority: "0.7" },
          { path: "/waste/report", changefreq: "weekly", priority: "0.6" },
          { path: "/waste/pickups", changefreq: "weekly", priority: "0.6" },
          { path: "/wallet", changefreq: "weekly", priority: "0.6" },
          { path: "/orders", changefreq: "weekly", priority: "0.6" },
          { path: "/learning/catalog", changefreq: "weekly", priority: "0.6" },
          { path: "/learning/my-courses", changefreq: "weekly", priority: "0.6" },
          { path: "/learning/certificates", changefreq: "monthly", priority: "0.5" },
          { path: "/processor/pickups", changefreq: "weekly", priority: "0.6" },
          { path: "/processor/inventory", changefreq: "weekly", priority: "0.6" },
          { path: "/processor/products", changefreq: "weekly", priority: "0.6" },
          { path: "/processor/earnings", changefreq: "monthly", priority: "0.5" },
          { path: "/ai-advisor", changefreq: "weekly", priority: "0.6" },
          { path: "/iot", changefreq: "weekly", priority: "0.6" },
          { path: "/admin/users", changefreq: "monthly", priority: "0.5" },
          { path: "/admin/waste", changefreq: "weekly", priority: "0.5" },
          { path: "/admin/marketplace", changefreq: "weekly", priority: "0.5" },
          { path: "/admin/courses", changefreq: "weekly", priority: "0.5" },
          { path: "/admin/iot", changefreq: "weekly", priority: "0.5" },
          { path: "/admin/finances", changefreq: "monthly", priority: "0.5" },
          { path: "/admin/environment", changefreq: "monthly", priority: "0.4" },
          { path: "/admin/analytics", changefreq: "weekly", priority: "0.5" },
          { path: "/notifications", changefreq: "weekly", priority: "0.5" },
          { path: "/settings", changefreq: "monthly", priority: "0.5" },
        ];

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
