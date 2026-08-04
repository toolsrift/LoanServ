import { Container, Eyebrow } from "@/components/ui/primitives";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { FaqJsonLd } from "@/components/seo/JsonLd";
import type { Faq } from "@/data/types";

export function FaqSection({
  faqs,
  title = "Frequently asked questions",
  eyebrow = "FAQ",
  withSchema = true,
  bare = false,
}: {
  faqs: Faq[];
  title?: string;
  eyebrow?: string;
  withSchema?: boolean;
  bare?: boolean;
}) {
  if (!faqs.length) return null;

  const body = (
    <>
      {withSchema && <FaqJsonLd faqs={faqs} />}
      {!bare && (
        <div className="mb-8">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 className="mt-3 text-display-sm">{title}</h2>
        </div>
      )}
      <Accordion type="single" collapsible className="rounded-2xl border border-sand bg-white px-5 sm:px-6">
        {faqs.map((f, i) => (
          <AccordionItem key={i} value={`faq-${i}`} className="last:border-b-0">
            <AccordionTrigger>{f.q}</AccordionTrigger>
            <AccordionContent>{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );

  if (bare) return body;

  return (
    <section className="py-16 sm:py-20">
      <Container className="max-w-3xl">{body}</Container>
    </section>
  );
}
