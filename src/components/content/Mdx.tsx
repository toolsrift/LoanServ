import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { cn } from "@/lib/utils";

/** Renders an internal/external link appropriately. */
function MdxLink({ href = "", children }: { href?: string; children?: React.ReactNode }) {
  if (href.startsWith("/")) {
    return (
      <Link href={href} className="text-evergreen underline underline-offset-2">
        {children}
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-evergreen underline underline-offset-2">
      {children}
    </a>
  );
}

const components = {
  a: MdxLink,
  table: (props: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 overflow-x-auto rounded-xl border border-sand">
      <table className="w-full text-sm" {...props} />
    </div>
  ),
  th: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th className="border-b border-sand bg-muted/60 px-4 py-2.5 text-left font-semibold text-ink" {...props} />
  ),
  td: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td className="border-b border-sand/60 px-4 py-2.5 align-top" {...props} />
  ),
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote className="my-5 border-l-3 border-mint bg-mint/5 px-4 py-3 italic text-slate" {...props} />
  ),
};

export function Mdx({ source, className }: { source: string; className?: string }) {
  return (
    <div className={cn("prose-loanserv", className)}>
      <MDXRemote source={source} components={components} />
    </div>
  );
}
