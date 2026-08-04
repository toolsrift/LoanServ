import type { Metadata } from "next";
import { ClipboardList, PhoneCall, ShieldCheck, Sparkles } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container, Eyebrow, Card, Badge } from "@/components/ui/primitives";
import { ApplyForm } from "@/components/apply/ApplyForm";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Apply for a Loan — Free & No-Obligation",
  description:
    "Apply once, compare offers from 30+ banks and NBFCs. LoanServ's free, no-obligation application takes minutes — no Aadhaar, PAN or bank details needed to enquire.",
  path: "/apply",
});

const steps = [
  {
    icon: ClipboardList,
    title: "Tell us your requirement",
    desc: "Share a few basics — loan type, amount, city and your income profile. Takes about two minutes.",
  },
  {
    icon: Sparkles,
    title: "We match you to lenders",
    desc: "We compare our 30+ bank and NBFC partners and shortlist the ones most likely to approve you at a good rate.",
  },
  {
    icon: PhoneCall,
    title: "An advisor calls you back",
    desc: "A local advisor talks you through the best-fit offers and helps you apply — with zero obligation to proceed.",
  },
];

const trust = [
  "Free for borrowers — we're paid by lenders, not you",
  "One application, offers from 30+ banks & NBFCs",
  "No Aadhaar, PAN or bank details collected here",
  "A real advisor from our Hyderabad office, not a bot",
];

export default function ApplyPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Apply", href: "/apply" }]} />

      <section className="bg-paper py-14 sm:py-16">
        <Container>
          <Eyebrow>Apply for a loan</Eyebrow>
          <h1 className="mt-3 max-w-2xl text-display-lg text-ink">
            One free application. Offers from 30+ lenders.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate">
            Skip the branch queues and the guesswork. Tell us what you need and {site.name} compares
            our bank and NBFC partners to find offers that fit your profile — with no fee and no
            obligation.
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <Card key={s.title} className="p-6">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-evergreen/10 text-evergreen">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="num text-sm font-semibold text-muted-foreground">
                      Step {i + 1}
                    </span>
                  </div>
                  <h2 className="mt-4 font-display text-lg text-ink">{s.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate">{s.desc}</p>
                </Card>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="pb-16 sm:pb-20">
        <Container>
          <div className="mx-auto max-w-2xl">
            <div className="mb-5 flex flex-wrap gap-2">
              {trust.map((t) => (
                <Badge key={t} tone="mint">
                  {t}
                </Badge>
              ))}
            </div>

            <Card className="p-6 sm:p-8">
              <div className="mb-6 flex items-start gap-3 rounded-xl bg-muted p-4">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-evergreen" />
                <p className="text-sm text-slate">
                  Your privacy matters. This form never asks for Aadhaar, PAN or bank-account
                  details. We only use what you share to call you back and understand your
                  requirement.
                </p>
              </div>
              <ApplyForm />
            </Card>

            <p className="mt-6 text-center text-xs text-muted-foreground">{site.disclaimer}</p>
          </div>
        </Container>
      </section>
    </>
  );
}
