import { MetadataRoute } from "next";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://motor.medgeninsurance.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/about",
          "/faqs",
          "/terms",
          "/login",
          "/signup",
          "/cover-type",
          "/motor-type",
          "/motor-insurance",
          "/motor-insurance/*",
          "/comprehensive-insurance",
          "/third-party-insurance",
          "/guides",
          "/guides/*",
          "/support",
        ],
        disallow: [
          "/dashboard",
          "/otp-verify",
          "/personal-details",
          "/vehicle-details",
          "/vehicle-value",
          "/motor-subtype",
          "/date-selection",
          "/payment-success",
          "/forgot-password",
          "/forgot-password/*",
          "/api/",
          "/_next/",
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
