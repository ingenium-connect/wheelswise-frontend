const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://motor.medgeninsurance.com";

type BreadcrumbItem = {
  name: string;
  href: string;
};

export default function BreadcrumbJsonLd({
  items,
}: {
  items: BreadcrumbItem[];
}) {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${BASE_URL}${item.href}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
    />
  );
}
