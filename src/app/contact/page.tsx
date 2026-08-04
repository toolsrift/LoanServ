import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container, Eyebrow, Card, Badge } from "@/components/ui/primitives";
import { ApplyForm } from "@/components/apply/ApplyForm";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Contact LoanServ — Talk to a Loan Advisor in Hyderabad",
  description:
    "Reach LoanServ at our Nizampet, Hyderabad office. Email, WhatsApp or send your loan requirement online. Serving Andhra Pradesh, Telangana, Bangalore and Chennai, Mon–Sat.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Contact", href: "/contact" }]} />

      <section className="bg-paper py-14 sm:py-16">
        <Container>
          <Eyebrow>Contact us</Eyebrow>
          <h1 className="mt-3 max-w-2xl text-display-lg text-ink">
            Talk to a real loan advisor
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate">
            Have a question about a loan, or ready to apply? Reach us however suits you — a call, an
            email, a WhatsApp message, or the form on this page. There is never a fee for talking to
            us.
          </p>
        </Container>
      </section>

      <section className="pb-16 sm:pb-20">
        <Container>
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Left: contact details */}
            <div className="space-y-6">
              <Card className="p-6">
                <ul className="space-y-5">
                  <li className="flex gap-4">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-evergreen/10 text-evergreen">
                      <MapPin className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-medium text-ink">Office address</p>
                      <address className="mt-1 not-italic text-slate">{site.address.full}</address>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-evergreen/10 text-evergreen">
                      <Mail className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-medium text-ink">Email</p>
                      <a
                        href={`mailto:${site.email}`}
                        className="mt-1 inline-block text-evergreen underline underline-offset-2"
                      >
                        {site.email}
                      </a>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-evergreen/10 text-evergreen">
                      <MessageCircle className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-medium text-ink">WhatsApp</p>
                      <a
                        href={`https://wa.me/${site.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-block text-evergreen underline underline-offset-2"
                      >
                        Message us on WhatsApp
                      </a>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-evergreen/10 text-evergreen">
                      <Clock className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-medium text-ink">Working hours</p>
                      <p className="mt-1 text-slate">{site.hours}</p>
                    </div>
                  </li>
                </ul>

                <div className="mt-6 border-t border-sand pt-5">
                  <p className="text-sm font-medium text-ink">Areas we serve</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {site.regions.map((r) => (
                      <Badge key={r} tone="sand">
                        {r}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>

              <iframe
                src="https://www.google.com/maps?q=Nizampet,Hyderabad&output=embed"
                title="LoanServ office location — Nizampet, Hyderabad"
                loading="lazy"
                className="h-[320px] w-full rounded-2xl border border-sand"
                referrerPolicy="no-referrer-when-downgrade"
              />

              <p className="text-xs text-muted-foreground">{site.disclaimer}</p>
            </div>

            {/* Right: lead form */}
            <div>
              <Card className="p-6 sm:p-7">
                <h2 className="font-display text-display-sm text-ink">Send us your requirement</h2>
                <p className="mt-2 text-sm text-slate">
                  Fill in a few details and a local advisor will call you back. We never ask for
                  Aadhaar, PAN or bank details here.
                </p>
                <div className="mt-6">
                  <ApplyForm compact />
                </div>
              </Card>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
