import LandingMain from "@/components/LandingMain";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buy Motor Insurance Online in Kenya — Instant Quotes",
  description:
    "Get instant motor insurance quotes from Kenya's top underwriters. Compare comprehensive and third party cover for private, commercial & PSV vehicles. Pay via M-Pesa and receive your certificate instantly.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Wheelswise — Buy Motor Insurance Online in Kenya",
    description:
      "Compare comprehensive and TPO motor insurance from IRA-licensed underwriters. Instant quotes, M-Pesa payment, instant certificate issuance.",
    url: "/",
  },
};

export default function Home() {
  return (
    <>
      <LandingMain />
    </>
  );
}
