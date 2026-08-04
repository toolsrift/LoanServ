import Link from "next/link";
import { lenders } from "@/data/lenders";

/** A placeholder logo tile — brand-tinted initials until real logos are supplied. */
function LenderTile({ name, tint, slug }: { name: string; tint: string; slug: string }) {
  const initials = name
    .replace(/Bank|Finance|Finserv|Capital|Fincorp|Limited|Ltd/gi, "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
  return (
    <Link
      href={`/offers/${slug}`}
      className="flex h-16 w-40 shrink-0 items-center gap-2.5 rounded-xl border border-sand bg-white px-3 transition-shadow hover:shadow-soft"
      title={name}
    >
      {/* TODO: replace initials tile with real partner logo (alt text = lender name) */}
      <span
        className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-xs font-bold text-white"
        style={{ background: tint }}
        aria-hidden
      >
        {initials}
      </span>
      <span className="text-sm font-medium leading-tight text-slate">{name}</span>
    </Link>
  );
}

export function PartnerMarquee() {
  const row = [...lenders, ...lenders]; // duplicate for seamless loop
  return (
    <section className="overflow-hidden py-12">
      <div className="mx-auto mb-6 max-w-[1200px] px-5 text-center sm:px-6">
        <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Direct DSA tie-ups with 30+ banks &amp; NBFCs
        </p>
      </div>
      <div className="relative flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
        <div className="flex animate-marquee gap-4 pr-4">
          {row.map((l, i) => (
            <LenderTile key={`${l.slug}-${i}`} name={l.name} tint={l.tint} slug={l.slug} />
          ))}
        </div>
      </div>
    </section>
  );
}
