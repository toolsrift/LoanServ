import type { Metadata } from "next";
import { Building2, Compass, Handshake, ShieldCheck, Users } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container, Eyebrow, Card, Badge, AscendingRule } from "@/components/ui/primitives";
import { CtaBlock } from "@/components/sections/CtaBlock";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "About LoanServ — Your Local Loan DSA in Hyderabad",
  description:
    "LoanServ is a DSA loan facilitator based in Nizampet, Hyderabad, helping borrowers across AP, Telangana, Bangalore and Chennai compare and apply for loans from 30+ banks and NBFCs.",
  path: "/about",
});

const stats = [
  { value: "30+", label: "Bank & NBFC tie-ups" },
  { value: "4", label: "States & metros served" },
  { value: "6", label: "Days a week, on call" },
  { value: "₹0", label: "Charged to borrowers" },
];

const values = [
  {
    icon: Handshake,
    title: "Borrower-first, always",
    desc: "We earn from lenders, never from you. That keeps our advice honest and our recommendations aligned with the offer that actually fits your profile.",
  },
  {
    icon: ShieldCheck,
    title: "Clear about who we are",
    desc: "LoanServ is a facilitator and Direct Selling Agent — not a bank. We say so on every page so you always know exactly who approves your loan and on what terms.",
  },
  {
    icon: Compass,
    title: "Guidance over guesswork",
    desc: "We read the fine print — processing fees, foreclosure charges, reducing-balance maths — and translate it into plain language before you sign anything.",
  },
  {
    icon: Users,
    title: "Local, reachable people",
    desc: "A real advisor from our Nizampet office picks up the phone. No call-centre scripts, no chasing a ticket number for a loan that matters to your family.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "About", href: "/about" }]} />

      <section className="bg-paper py-14 sm:py-20">
        <Container>
          <Eyebrow>About LoanServ</Eyebrow>
          <h1 className="mt-3 max-w-3xl text-display-lg text-ink">
            A local loan facilitator built to make borrowing feel less like a maze
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-slate">
            {site.name} helps individuals and small businesses across Andhra Pradesh, Telangana,
            Bangalore and Chennai compare loan offers from 30+ banks and NBFCs — and apply to the one
            that truly fits. We do the legwork; the bank does the lending.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Badge tone="evergreen">DSA facilitator</Badge>
            <Badge tone="mint">No fee to borrowers</Badge>
            <Badge tone="saffron">Hyderabad based</Badge>
          </div>
        </Container>
      </section>

      <section className="border-y border-sand bg-white py-12">
        <Container>
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="num text-display-md text-evergreen">{s.value}</p>
                <p className="mt-1 text-sm text-slate">{s.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="max-w-3xl">
          <Eyebrow>Our story</Eyebrow>
          <h2 className="mt-3 text-display-sm text-ink">Why we started LoanServ</h2>
          <div className="prose-loanserv mt-5">
            <p>
              Most people meet a lender only a handful of times in their life — for a home, a car, a
              wedding, a medical emergency, or a push of working capital for a small business. Those
              are high-stakes moments, and yet the process around them is often confusing. Rates are
              quoted in flat terms that hide the real cost. Eligibility rules differ from one bank to
              the next. Applications get rejected for reasons nobody explains. We started {site.name}{" "}
              because we kept watching capable, creditworthy people either overpay or walk away
              entirely — simply because no one sat with them and made the choices legible.
            </p>
            <p>
              Our team comes from years of on-the-ground lending and loan-sourcing work in Hyderabad.
              We have seen which lenders move quickly for a salaried applicant in HITEC City, which
              NBFC is friendlier to a self-employed shop owner in Nizampet, and which bank will
              stretch tenure for a first-time home buyer. That practical, lived knowledge of how loan
              desks actually behave is what we bring to every conversation — and it is very different
              from a generic online comparison table.
            </p>

            <h3>What a DSA actually does — and why it helps you</h3>
            <p>
              A Direct Selling Agent (DSA) is an authorised channel partner for banks and NBFCs. When
              you come to us, we map your profile — income, employment, city, existing EMIs, credit
              history — against the eligibility grids of our partner lenders, then route your
              application to the ones most likely to approve it at a sensible rate. Because we submit
              to the right lender the first time, you avoid the credit-score damage that comes from
              applying scattershot to five banks at once.
            </p>
            <p>
              Importantly, our service is free for you. Banks and NBFCs pay a sourcing commission to
              their DSA partners; you pay only the lender&apos;s own processing fee, exactly as you
              would if you had walked into the branch yourself. We are transparent about this because
              it is the whole reason we can stay on your side of the table.
            </p>

            <h3>What we are — and what we are not</h3>
            <p>
              {site.disclaimer} We do not sanction loans, set interest rates, or take custody of your
              money. What we do is help you understand your options, prepare a clean application, and
              stay with you until the amount is disbursed. Approval and final terms rest entirely with
              the partner bank or NBFC — and we will always tell you plainly if we think an offer
              isn&apos;t right for you, even when it means recommending you wait or borrow less.
            </p>

            <h3>Experience you can hold us to</h3>
            <p>
              Trust in money matters is earned, not claimed. That is why we keep a physical office you
              can visit, publish our hours, and put a named advisor on every case. We handle personal,
              business, home, loan-against-property, car, gold and professional loans — and we would
              rather explain a rejection honestly than push you into a product that hurts your
              finances. If a loan doesn&apos;t make sense for you today, we will say so.
            </p>
          </div>
        </Container>
      </section>

      <AscendingRule />

      <section className="py-14 sm:py-16">
        <Container>
          <Eyebrow>What we stand for</Eyebrow>
          <h2 className="mt-3 max-w-xl text-display-sm text-ink">Principles that shape every call</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <Card key={v.title} className="p-6">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-evergreen/10 text-evergreen">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-display text-lg text-ink">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate">{v.desc}</p>
                </Card>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="pb-16 sm:pb-20">
        <Container>
          <Card className="flex flex-col gap-5 p-7 sm:flex-row sm:items-start sm:gap-7">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-saffron/15 text-[#8a5a04]">
              <Building2 className="h-6 w-6" />
            </span>
            <div>
              <h2 className="font-display text-display-sm text-ink">Where to find us</h2>
              <p className="mt-2 max-w-xl text-slate">
                We work out of a physical office in Nizampet, Hyderabad — so you can talk to a real
                person, not a chatbot, about a decision this important.
              </p>
              <address className="mt-4 not-italic text-slate">
                <span className="block font-medium text-ink">{site.name}</span>
                <span className="block">{site.address.full}</span>
                <span className="mt-2 block text-sm text-muted-foreground">
                  Open {site.hours}
                </span>
                <a
                  href={`mailto:${site.email}`}
                  className="mt-1 inline-block text-sm text-evergreen underline underline-offset-2"
                >
                  {site.email}
                </a>
              </address>
            </div>
          </Card>
        </Container>
      </section>

      <CtaBlock
        title="Let's find the loan that actually fits"
        subtitle="One free, no-obligation application. A local advisor reviews your profile and calls you back."
      />
    </>
  );
}
