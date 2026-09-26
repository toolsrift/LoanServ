import type { Metadata } from "next";
import { Container, Eyebrow } from "@/components/ui/primitives";
import { PartnerPortal } from "@/components/partner/PartnerPortal";

// For LoanServ's referral partners only — kept out of search results and the sitemap.
export const metadata: Metadata = {
  title: "Partner portal",
  robots: { index: false, follow: false },
};

export default function PartnerPortalPage() {
  return (
    <section className="bg-paper py-12 sm:py-16">
      <Container className="max-w-3xl">
        <Eyebrow>Partners</Eyebrow>
        <h1 className="mt-3 text-display-md text-ink">Refer a customer</h1>
        <p className="mt-3 text-slate">
          Share a customer who needs a loan. We never contact them until they confirm: you&apos;ll get a link to
          send them on WhatsApp, and they choose whether LoanServ may call. Every confirmed referral is credited
          to your partner code.
        </p>
        <div className="mt-8">
          <PartnerPortal />
        </div>
      </Container>
    </section>
  );
}
