import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, GraduationCap, Library, PlayCircle, ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container, Section, Eyebrow, Badge } from "@/components/ui/primitives";
import { CtaBlock } from "@/components/sections/CtaBlock";
import { buildMetadata } from "@/lib/seo";
import { listDocs } from "@/lib/content";

export const metadata: Metadata = buildMetadata({
  title: "Knowledge Center — Loan Guides, Tutorials & Glossary",
  description:
    "Everything you need to borrow smarter: in-depth loan product guides, step-by-step how-to tutorials, a plain-English lending glossary and helpful videos.",
  path: "/knowledge-center",
});

const SECTIONS = [
  {
    href: "/knowledge-center/product-info",
    icon: BookOpen,
    title: "Product Info",
    desc: "Deep-dive guides on personal, home, business loans and loan against property — eligibility, rates, documents and smart borrowing.",
    tint: "bg-evergreen/10 text-evergreen",
  },
  {
    href: "/knowledge-center/tutorials",
    icon: GraduationCap,
    title: "Guides & Tutorials",
    desc: "Practical, step-by-step walkthroughs — how to apply, check eligibility, read your credit report and switch to a cheaper loan.",
    tint: "bg-mint/15 text-[#0c6b4c]",
  },
  {
    href: "/knowledge-center/glossary",
    icon: Library,
    title: "Glossary",
    desc: "An A–Z of lending terms explained in plain English, from Amortisation and APR to Working Capital.",
    tint: "bg-saffron/15 text-[#8a5a04]",
  },
  {
    href: "/knowledge-center/videos",
    icon: PlayCircle,
    title: "Videos",
    desc: "Short explainer videos that make loans, EMIs and credit scores easy to understand. Coming soon.",
    tint: "bg-sand text-slate",
  },
];

export default function KnowledgeCenterPage() {
  const products = listDocs("knowledge-center/product-info");
  const tutorials = listDocs("knowledge-center/tutorials");

  return (
    <>
      <Breadcrumbs items={[{ name: "Knowledge Center", href: "/knowledge-center" }]} />

      <section className="bg-paper py-12 sm:py-16">
        <Container>
          <Eyebrow>Knowledge Center</Eyebrow>
          <h1 className="mt-3 max-w-2xl text-display-lg text-ink">Learn before you borrow</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate">
            Original, jargon-free resources from LoanServ&apos;s lending team — product guides, how-to tutorials and a
            complete glossary — so you can compare loans with confidence and never sign blind.
          </p>
        </Container>
      </section>

      <Section tone="muted" className="py-12 sm:py-16">
        <Container>
          <div className="grid gap-5 sm:grid-cols-2">
            {SECTIONS.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="group rounded-2xl border border-sand bg-card p-6 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
              >
                <span className={`inline-grid h-11 w-11 place-items-center rounded-xl ${s.tint}`}>
                  <s.icon className="h-5 w-5" />
                </span>
                <h2 className="mt-4 flex items-center gap-1.5 font-display text-xl text-ink group-hover:text-evergreen">
                  {s.title}
                  <ArrowRight className="h-4 w-4 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                </h2>
                <p className="mt-2 text-sm text-slate">{s.desc}</p>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="py-12 sm:py-16">
        <Container>
          <Eyebrow>Product Info</Eyebrow>
          <h2 className="mt-3 text-display-sm text-ink">Loan product guides</h2>
          <p className="mt-3 max-w-2xl text-slate">
            Complete, India-focused guides to every major loan type we help you apply for.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {products.map((d) => (
              <Link
                key={d.slug}
                href={`/knowledge-center/product-info/${d.slug}`}
                className="group rounded-2xl border border-sand bg-card p-6 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
              >
                <Badge tone="evergreen">Guide</Badge>
                <h3 className="mt-3 font-display text-lg leading-snug text-ink group-hover:text-evergreen">
                  {d.frontmatter.title}
                </h3>
                {d.frontmatter.description && (
                  <p className="mt-2 line-clamp-2 text-sm text-slate">{d.frontmatter.description}</p>
                )}
              </Link>
            ))}
          </div>

          <div className="mt-14">
            <Eyebrow>Guides &amp; Tutorials</Eyebrow>
            <h2 className="mt-3 text-display-sm text-ink">Step-by-step tutorials</h2>
            <p className="mt-3 max-w-2xl text-slate">
              Practical walkthroughs that take you from question to done, one clear step at a time.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {tutorials.map((d) => (
                <Link
                  key={d.slug}
                  href={`/knowledge-center/tutorials/${d.slug}`}
                  className="group rounded-2xl border border-sand bg-card p-6 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
                >
                  <Badge tone="mint">Tutorial</Badge>
                  <h3 className="mt-3 font-display text-lg leading-snug text-ink group-hover:text-evergreen">
                    {d.frontmatter.title}
                  </h3>
                  {d.frontmatter.description && (
                    <p className="mt-2 line-clamp-2 text-sm text-slate">{d.frontmatter.description}</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <CtaBlock />
    </>
  );
}
