import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { cities, getCity } from "@/data/cities";
import { buildMetadata } from "@/lib/seo";
import { LocationPageTemplate } from "@/templates/LocationPageTemplate";

export function generateStaticParams() {
  return cities.map((c) => ({ city: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city } = await params;
  const data = getCity(city);
  if (!data) return {};
  return buildMetadata({ title: data.metaTitle, description: data.metaDescription, path: `/locations/${data.slug}` });
}

export default async function LocationPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  const data = getCity(city);
  if (!data) notFound();
  return <LocationPageTemplate city={data} />;
}
