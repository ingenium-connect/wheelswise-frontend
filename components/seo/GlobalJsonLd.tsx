const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://motor.medgeninsurance.com";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": ["Organization", "InsuranceAgency"],
  name: "Wheelswise",
  legalName: "MedGen Insurance Agency",
  url: BASE_URL,
  logo: `${BASE_URL}/logo.png`,
  image: `${BASE_URL}/logo.png`,
  description:
    "Kenya's digital motor insurance platform connecting motorists with IRA-licensed underwriters for comprehensive and third-party motor insurance.",
  telephone: "+254717227690",
  email: "support@medgeninsurance.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Ushirika Road, Karen",
    addressLocality: "Nairobi",
    addressRegion: "Nairobi County",
    addressCountry: "KE",
  },
  areaServed: { "@type": "Country", name: "Kenya" },
  knowsAbout: [
    "Motor Insurance",
    "Comprehensive Vehicle Insurance",
    "Third Party Insurance",
    "Commercial Vehicle Insurance",
    "PSV Insurance Kenya",
    "Insurance Underwriting Kenya",
    "Motor Vehicle Insurance Kenya",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Motor Insurance Products",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Comprehensive Motor Insurance",
          description:
            "Full motor vehicle coverage including own damage, theft, fire, and third-party liability",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Third Party Only (TPO) Insurance",
          description:
            "Minimum legal motor insurance covering third-party bodily injury and property damage in Kenya",
        },
      },
    ],
  },
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+254717227690",
      contactType: "customer support",
      availableLanguage: ["English", "Swahili"],
      areaServed: "KE",
    },
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Wheelswise",
  alternateName: "MedGen Insurance",
  url: BASE_URL,
  description:
    "Buy motor insurance online in Kenya — compare quotes from top underwriters, pay via M-Pesa, get your certificate instantly.",
  inLanguage: "en-KE",
  publisher: {
    "@type": "Organization",
    name: "MedGen Insurance Agency",
    url: BASE_URL,
  },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `https://www.google.com/search?q=site:motor.medgeninsurance.com+{search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export default function GlobalJsonLd() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}
