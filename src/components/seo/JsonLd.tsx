import { site } from "@/lib/site";

/** Renders a JSON-LD script tag. Data is trusted (built server-side from our own config). */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** Site-wide FinancialService + LocalBusiness identity. Rendered once in the root layout. */
export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": ["FinancialService", "LocalBusiness"],
    "@id": `${site.url}/#organization`,
    name: site.name,
    url: site.url,
    email: site.email,
    description: site.description,
    areaServed: site.regions,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
    openingHours: "Mo-Sa 10:00-19:00",
    priceRange: "Free consultation",
    slogan: site.tagline,
  };
  return <JsonLd data={data} />;
}

export function BreadcrumbJsonLd({ items }: { items: { name: string; href: string }[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${site.url}${item.href}`,
    })),
  };
  return <JsonLd data={data} />;
}

export function FaqJsonLd({ faqs }: { faqs: { q: string; a: string }[] }) {
  if (!faqs.length) return null;
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return <JsonLd data={data} />;
}

export function ArticleJsonLd({
  title,
  description,
  slug,
  datePublished,
  dateModified,
  author = site.name,
  image,
}: {
  title: string;
  description: string;
  slug: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
  image?: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    author: { "@type": "Organization", name: author },
    publisher: {
      "@type": "Organization",
      name: site.name,
      logo: { "@type": "ImageObject", url: `${site.url}/icon.png` },
    },
    datePublished,
    dateModified: dateModified || datePublished,
    mainEntityOfPage: `${site.url}${slug}`,
    image: image ? `${site.url}${image}` : `${site.url}/opengraph-image`,
  };
  return <JsonLd data={data} />;
}

/** Offer / FinancialProduct schema for lender offer pages. */
export function FinancialProductJsonLd({
  name,
  description,
  url,
  provider,
  rateFrom,
}: {
  name: string;
  description: string;
  url: string;
  provider: string;
  rateFrom?: number;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    name,
    description,
    url: `${site.url}${url}`,
    provider: { "@type": "Organization", name: provider },
    ...(rateFrom
      ? {
          interestRate: {
            "@type": "QuantitativeValue",
            value: rateFrom,
            unitText: "% per annum",
          },
        }
      : {}),
    category: "Loan",
    areaServed: "IN",
  };
  return <JsonLd data={data} />;
}
