import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/primitives";
import { ReferralDecision } from "@/components/partner/ReferralDecision";
import { getReferralByToken, maskMobile } from "@/lib/partners";
import { formatINR } from "@/lib/format";

// Personal, one-time pages: never indexed, never cached.
export const metadata: Metadata = {
  title: "Confirm your loan enquiry",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function ConfirmReferralPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const r = await getReferralByToken(token);

  return (
    <section className="bg-paper py-12 sm:py-16">
      <Container className="max-w-xl">
        {!r || r.status === "expired" ? (
          <Notice title="This link has expired">
            Confirmation links work for 7 days. If you&apos;d still like help with a loan, you can{" "}
            <Link href="/apply" className="text-evergreen underline">
              apply here
            </Link>{" "}
            or ask the person who referred you to send a new link.
          </Notice>
        ) : r.status === "confirmed" ? (
          <Notice title="Already confirmed">Thank you — a LoanServ advisor will be in touch.</Notice>
        ) : r.status === "declined" ? (
          <Notice title="You won't be contacted">We won&apos;t contact you about this enquiry.</Notice>
        ) : (
          <>
            <h1 className="text-display-md text-ink">Confirm your loan enquiry</h1>
            <p className="mt-3 text-slate">
              <b>{r.partner_name || "A LoanServ partner"}</b> referred you to LoanServ for help with a loan.
              We haven&apos;t contacted you, and we won&apos;t unless you confirm below.
            </p>
            <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-2 rounded-2xl border border-sand bg-white p-5 text-sm">
              <dt className="text-muted-foreground">Name</dt>
              <dd className="text-ink">{r.full_name.trim().split(/\s+/)[0]}</dd>
              <dt className="text-muted-foreground">Mobile</dt>
              <dd className="num text-ink">+91 {maskMobile(r.mobile)}</dd>
              <dt className="text-muted-foreground">Loan</dt>
              <dd className="text-ink">
                {r.category} · <span className="num">{formatINR(Number(r.amount))}</span>
              </dd>
              <dt className="text-muted-foreground">City</dt>
              <dd className="text-ink">{r.city}</dd>
            </dl>
            <div className="mt-6">
              <ReferralDecision token={token} />
            </div>
          </>
        )}
      </Container>
    </section>
  );
}

function Notice({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-sand bg-white p-6">
      <h1 className="font-display text-2xl text-ink">{title}</h1>
      <p className="mt-2 text-slate">{children}</p>
    </div>
  );
}
