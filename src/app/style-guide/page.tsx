import type { Metadata } from "next";
import type * as React from "react";
import { ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container, Eyebrow, Card, Badge, AscendingRule } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { Field, Input, NativeSelect, Textarea } from "@/components/ui/field";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Style Guide — The Ledger Design System",
    description:
      "A live rendering of LoanServ's Ledger design system: colour palette, type scale, buttons, cards, badges and form fields.",
    path: "/style-guide",
  }),
  robots: { index: false },
};

const palette = [
  { name: "Ink", hex: "#0C231E", className: "bg-ink", dark: true },
  { name: "Evergreen", hex: "#0E5A4A", className: "bg-evergreen", dark: true },
  { name: "Mint", hex: "#22C58B", className: "bg-mint", dark: false },
  { name: "Saffron", hex: "#F6A623", className: "bg-saffron", dark: false },
  { name: "Paper", hex: "#F7F6F1", className: "bg-paper", dark: false },
  { name: "Sand", hex: "#E7E3D8", className: "bg-sand", dark: false },
  { name: "Slate", hex: "#2A3A35", className: "bg-slate", dark: true },
];

const buttonVariants = ["primary", "secondary", "ink", "outline", "ghost", "link"] as const;
const buttonSizes = ["sm", "md", "lg"] as const;

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="py-10 border-b border-sand last:border-b-0">
      <h2 className="font-display text-display-sm text-ink">{title}</h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export default function StyleGuidePage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Style Guide", href: "/style-guide" }]} />

      <section className="bg-paper py-14 sm:py-16">
        <Container>
          <Eyebrow>Design system</Eyebrow>
          <h1 className="mt-3 text-display-lg text-ink">The Ledger system</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate">
            A live rendering of the tokens and components that make up LoanServ&apos;s interface —
            palette, type scale, buttons, cards, badges and form fields.
          </p>
        </Container>
      </section>

      <Container className="pb-20">
        {/* Palette */}
        <Block title="Palette">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {palette.map((c) => (
              <Card key={c.name} className="overflow-hidden">
                <div className={`h-24 w-full ${c.className}`} />
                <div className="p-4">
                  <p className="font-medium text-ink">{c.name}</p>
                  <p className="num mt-0.5 text-sm text-muted-foreground">{c.hex}</p>
                </div>
              </Card>
            ))}
          </div>
        </Block>

        {/* Type scale */}
        <Block title="Type scale">
          <div className="space-y-5">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">text-display-xl</p>
              <p className="text-display-xl text-ink">Borrow with clarity</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">text-display-lg</p>
              <p className="text-display-lg text-ink">Compare 30+ lenders</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">text-display-md</p>
              <p className="text-display-md text-ink">Find the right loan</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">text-display-sm</p>
              <p className="text-display-sm text-ink">Apply in minutes</p>
            </div>
            <AscendingRule className="py-2" />
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Body</p>
              <p className="max-w-prose text-slate">
                Body copy is set in the sans family at a comfortable reading measure. It carries the
                bulk of explanatory content across the site, kept to around 68 characters per line.
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                .num — tabular mono numerals
              </p>
              <p className="num text-display-md text-evergreen">₹1,23,456</p>
            </div>
          </div>
        </Block>

        {/* Buttons */}
        <Block title="Buttons">
          <div className="space-y-6">
            <div>
              <p className="mb-3 text-xs uppercase tracking-wide text-muted-foreground">Variants</p>
              <div className="flex flex-wrap items-center gap-3">
                {buttonVariants.map((v) => (
                  <Button key={v} variant={v}>
                    {v}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-3 text-xs uppercase tracking-wide text-muted-foreground">Sizes</p>
              <div className="flex flex-wrap items-center gap-3">
                {buttonSizes.map((s) => (
                  <Button key={s} variant="primary" size={s}>
                    Size {s}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-3 text-xs uppercase tracking-wide text-muted-foreground">With icon</p>
              <Button variant="secondary">
                Apply now <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Block>

        {/* Cards */}
        <Block title="Cards">
          <div className="grid gap-5 sm:grid-cols-2">
            <Card className="p-6">
              <h3 className="font-display text-lg text-ink">Standard card</h3>
              <p className="mt-2 text-sm text-slate">
                Rounded-2xl, sand border, soft shadow. The workhorse container across the site.
              </p>
            </Card>
            <Card className="bg-muted p-6">
              <h3 className="font-display text-lg text-ink">Muted card</h3>
              <p className="mt-2 text-sm text-slate">
                Same shape on a muted surface — used for callouts and secondary panels.
              </p>
            </Card>
          </div>
        </Block>

        {/* Badges */}
        <Block title="Badges">
          <div className="flex flex-wrap gap-3">
            <Badge tone="evergreen">Evergreen</Badge>
            <Badge tone="saffron">Saffron</Badge>
            <Badge tone="mint">Mint</Badge>
            <Badge tone="sand">Sand</Badge>
          </div>
        </Block>

        {/* Form fields */}
        <Block title="Form fields">
          <div className="grid max-w-2xl gap-5 sm:grid-cols-2">
            <Field label="Full name" htmlFor="sg-name" required>
              <Input id="sg-name" placeholder="e.g. Ravi Kumar" />
            </Field>
            <Field label="Mobile number" htmlFor="sg-mobile" required hint="10-digit Indian mobile">
              <Input id="sg-mobile" inputMode="numeric" placeholder="9876543210" className="num" />
            </Field>
            <Field label="Loan category" htmlFor="sg-category">
              <NativeSelect id="sg-category" defaultValue="Personal">
                <option>Personal</option>
                <option>Business</option>
                <option>Home</option>
              </NativeSelect>
            </Field>
            <Field label="Email address" htmlFor="sg-email" error="Please enter a valid email">
              <Input id="sg-email" type="email" placeholder="you@example.com" />
            </Field>
            <Field label="Message" htmlFor="sg-msg" className="sm:col-span-2">
              <Textarea id="sg-msg" rows={3} placeholder="Tell us about your requirement…" />
            </Field>
          </div>
        </Block>
      </Container>
    </>
  );
}
