import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Wheelswise — Motor Insurance Kenya",
    short_name: "Wheelswise",
    description:
      "Compare and buy motor insurance online in Kenya. Comprehensive and TPO cover. Pay via M-Pesa.",
    start_url: "/",
    display: "standalone",
    background_color: "#f0f6f9",
    theme_color: "#397397",
    icons: [
      {
        src: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    categories: ["finance", "insurance", "business"],
    lang: "en-KE",
  };
}
