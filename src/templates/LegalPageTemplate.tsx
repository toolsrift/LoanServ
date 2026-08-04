import { Container } from "@/components/ui/primitives";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Mdx } from "@/components/content/Mdx";
import type { Doc } from "@/lib/content";

export function LegalPageTemplate({ doc }: { doc: Doc }) {
  const fm = doc.frontmatter;
  return (
    <>
      <Breadcrumbs items={[{ name: "Legal", href: "/legal/privacy-policy" }, { name: fm.title, href: `/legal/${doc.slug}` }]} />
      <section className="py-10 sm:py-14">
        <Container className="max-w-3xl">
          <h1 className="text-display-md text-ink">{fm.title}</h1>
          {fm.updated && (
            <p className="num mt-3 text-sm text-muted-foreground">Last updated: {formatDate(fm.updated)}</p>
          )}
          <div className="mt-8">
            <Mdx source={doc.content} />
          </div>
        </Container>
      </section>
    </>
  );
}

function formatDate(date: string) {
  try {
    return new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return date;
  }
}
