"use client";

import * as React from "react";
import Link from "next/link";
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

export interface BlogListItem {
  slug: string;
  title: string;
  description: string;
  category: string;
  date: string;
  readingTime: number;
}

export function BlogList({ posts, categories }: { posts: BlogListItem[]; categories: string[] }) {
  const [active, setActive] = React.useState("All");
  const filtered = active === "All" ? posts : posts.filter((p) => p.category === active);

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-2">
        {["All", ...categories].map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              active === c
                ? "border-evergreen bg-evergreen text-white"
                : "border-sand bg-white text-slate hover:border-evergreen hover:text-evergreen",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <Link
            key={p.slug}
            href={`/blog/${p.slug}`}
            className="group flex h-full flex-col rounded-2xl border border-sand bg-white p-6 transition-all hover:-translate-y-0.5 hover:shadow-lift"
          >
            <Badge tone="mint">{p.category}</Badge>
            <h2 className="mt-3 font-display text-lg leading-snug text-ink group-hover:text-evergreen">{p.title}</h2>
            <p className="mt-2 flex-1 text-sm text-muted-foreground line-clamp-3">{p.description}</p>
            <p className="num mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" /> {p.readingTime} min read
            </p>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && <p className="text-muted-foreground">No articles in this category yet.</p>}
    </div>
  );
}
