import type { Metadata } from "next";
import { Container, Eyebrow } from "@/components/ui/primitives";
import { PartnerLinkBuilder } from "@/components/tools/PartnerLinkBuilder";

// Internal tool for the LoanServ team — kept out of search results and the sitemap.
export const metadata: Metadata = {
  title: "Partner referral links",
  robots: { index: false, follow: false },
};

export default function PartnerLinksPage() {
  return (
    <section className="bg-paper py-12 sm:py-16">
      <Container className="max-w-3xl">
        <Eyebrow>Team tool</Eyebrow>
        <h1 className="mt-3 text-display-md text-ink">Partner referral links</h1>
        <p className="mt-3 text-slate">
          Make a tracked link and QR code for a referral partner or a customer. Leads that arrive through it
          within 30 days are tagged <span className="num">[Partner: code]</span> in the lead email and the lead
          database. See LEADS.md for how partner tracking works.
        </p>
        <div className="mt-8">
          <PartnerLinkBuilder />
        </div>
      </Container>
    </section>
  );
}
