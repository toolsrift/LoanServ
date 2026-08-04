import Link from "next/link";
import { Container } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/brand/Logo";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <LogoMark className="h-14 w-14" />
      <p className="num mt-6 text-6xl font-semibold text-ink">404</p>
      <h1 className="mt-2 text-display-sm">This page took a different route</h1>
      <p className="mt-3 max-w-md text-slate">
        The page you&apos;re looking for doesn&apos;t exist or has moved. Let&apos;s get you back to comparing loans.
      </p>
      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <Button asChild variant="primary" size="lg">
          <Link href="/">Back to home</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/loans">Browse loans</Link>
        </Button>
      </div>
      <div className="mt-8 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
        <Link href="/calculators" className="hover:text-evergreen">
          Calculators
        </Link>
        <Link href="/offers" className="hover:text-evergreen">
          This month&apos;s offers
        </Link>
        <Link href="/free-cibil-score" className="hover:text-evergreen">
          Free CIBIL score
        </Link>
        <Link href="/blog" className="hover:text-evergreen">
          Blog
        </Link>
      </div>
    </Container>
  );
}
