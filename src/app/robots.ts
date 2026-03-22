import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const origin = new URL(
    (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
      /\/$/,
      "",
    ),
  ).origin;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    sitemap: `${origin}/sitemap.xml`,
  };
}
