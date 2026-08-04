import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { Container, Eyebrow, Badge } from "@/components/ui/primitives";
import { listDocs } from "@/lib/content";

export function LatestBlog() {
  const posts = listDocs("blog").slice(0, 3);
  if (!posts.length) return null;

  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <Eyebrow>From the blog</Eyebrow>
            <h2 className="mt-3 text-display-sm">Borrow smarter</h2>
          </div>
          <Link href="/blog" className="hidden shrink-0 items-center gap-1 text-sm font-medium text-evergreen hover:underline sm:flex">
            All articles <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {posts.map((p) => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              className="group flex h-full flex-col rounded-2xl border border-sand bg-white p-6 transition-all hover:-translate-y-0.5 hover:shadow-lift"
            >
              {p.frontmatter.category && <Badge tone="mint">{p.frontmatter.category}</Badge>}
              <h3 className="mt-3 font-display text-lg leading-snug text-ink group-hover:text-evergreen">
                {p.frontmatter.title}
              </h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground line-clamp-3">{p.frontmatter.description}</p>
              <p className="num mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" /> {p.readingTime} min read
              </p>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
