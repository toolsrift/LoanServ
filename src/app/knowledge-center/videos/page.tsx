import type { Metadata } from "next";
import Link from "next/link";
import { PlayCircle, Clock, ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container, Eyebrow, Card, Badge } from "@/components/ui/primitives";
import { CtaBlock } from "@/components/sections/CtaBlock";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Loan Explainer Videos — Coming Soon | LoanServ Knowledge Center",
  description:
    "Short, easy-to-follow explainer videos on loans, EMIs, credit scores and balance transfers are coming soon to the LoanServ Knowledge Center.",
  path: "/knowledge-center/videos",
});

// TODO: replace these placeholders with real embedded videos once produced.
const PLANNED = [
  {
    title: "How an EMI is actually calculated",
    desc: "A 3-minute visual breakdown of principal, interest and how the EMI stays flat while the split shifts.",
    href: "/knowledge-center/glossary#emi",
  },
  {
    title: "Reading your CIBIL report in 5 minutes",
    desc: "What each section means, the numbers that matter, and how to spot errors that cost you approvals.",
    href: "/knowledge-center/tutorials/how-to-read-your-credit-report",
  },
  {
    title: "Should you do a balance transfer?",
    desc: "When switching lenders saves money, when it doesn't, and the costs to check before you move.",
    href: "/knowledge-center/tutorials/how-to-do-a-balance-transfer",
  },
  {
    title: "Fixed vs floating interest rates",
    desc: "The trade-offs explained simply, so you can choose the rate type that fits your loan and your nerves.",
    href: "/knowledge-center/glossary#floating-interest-rate",
  },
];

export default function VideosPage() {
  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Knowledge Center", href: "/knowledge-center" },
          { name: "Videos", href: "/knowledge-center/videos" },
        ]}
      />

      <section className="bg-paper py-12 sm:py-16">
        <Container>
          <Eyebrow>Videos</Eyebrow>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <h1 className="text-display-lg text-ink">Explainer videos</h1>
            <Badge tone="saffron">Coming soon</Badge>
          </div>
          <p className="mt-4 max-w-2xl text-lg text-slate">
            We&apos;re producing short, plain-English videos that make loans, EMIs and credit scores easy to understand.
            Here&apos;s what&apos;s on the way. In the meantime, our written guides and glossary cover it all.
          </p>
        </Container>
      </section>

      <section className="pb-16">
        <Container>
          <div className="grid gap-5 sm:grid-cols-2">
            {PLANNED.map((v) => (
              <Card key={v.title} className="flex flex-col overflow-hidden p-0">
                {/* placeholder poster */}
                <div className="relative grid aspect-video place-items-center bg-gradient-to-br from-evergreen/10 via-mint/10 to-saffron/10">
                  <PlayCircle className="h-12 w-12 text-evergreen/60" aria-hidden />
                  <span className="absolute left-3 top-3">
                    <Badge tone="sand">Coming soon</Badge>
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="num flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" /> In production
                  </div>
                  <h2 className="mt-2 font-display text-lg leading-snug text-ink">{v.title}</h2>
                  <p className="mt-2 flex-1 text-sm text-slate">{v.desc}</p>
                  <Link
                    href={v.href}
                    className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-evergreen hover:underline"
                  >
                    Read about this now <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </Card>
            ))}
          </div>

          <p className="mt-10 max-w-2xl text-sm text-muted-foreground">
            Prefer to read? Explore our{" "}
            <Link href="/knowledge-center/product-info" className="font-medium text-evergreen hover:underline">
              loan product guides
            </Link>{" "}
            and{" "}
            <Link href="/knowledge-center/tutorials" className="font-medium text-evergreen hover:underline">
              step-by-step tutorials
            </Link>
            .
          </p>
        </Container>
      </section>

      <CtaBlock />
    </>
  );
}
