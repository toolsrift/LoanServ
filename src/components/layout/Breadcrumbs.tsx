import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/primitives";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export interface Crumb {
  name: string;
  href: string;
}

/** Slim breadcrumb bar for inner pages + matching BreadcrumbList schema. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const full: Crumb[] = [{ name: "Home", href: "/" }, ...items].filter(
    (crumb, i, arr) => arr.findLastIndex((c) => c.href === crumb.href) === i,
  );
  return (
    <div className="border-b border-sand bg-paper/60">
      <Container>
        <BreadcrumbJsonLd items={full} />
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 py-3 text-sm text-muted-foreground">
          {full.map((crumb, i) => {
            const last = i === full.length - 1;
            return (
              <span key={crumb.href} className="flex items-center gap-1">
                {last ? (
                  <span className="font-medium text-slate" aria-current="page">
                    {crumb.name}
                  </span>
                ) : (
                  <Link href={crumb.href} className="hover:text-evergreen">
                    {crumb.name}
                  </Link>
                )}
                {!last && <ChevronRight className="h-3.5 w-3.5" />}
              </span>
            );
          })}
        </nav>
      </Container>
    </div>
  );
}
