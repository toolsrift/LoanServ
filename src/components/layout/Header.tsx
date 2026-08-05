"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronDown, Menu, X, Phone, TrendingUp } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { ApplyButton } from "@/components/apply/ApplyButton";
import { megaMenus } from "@/data/nav";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Header() {
  const [openMenu, setOpenMenu] = React.useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const closeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuToggleRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Mobile menu: lock body scroll, close on Escape, return focus to the toggle.
  React.useEffect(() => {
    if (!mobileOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        menuToggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen]);

  const enter = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(label);
  };
  const leave = () => {
    closeTimer.current = setTimeout(() => setOpenMenu(null), 120);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b transition-shadow print:hidden",
        scrolled ? "border-sand bg-paper/90 shadow-soft backdrop-blur" : "border-transparent bg-paper",
      )}
    >
      {/* Utility bar */}
      <div className="hidden border-b border-sand/70 bg-ink text-paper lg:block">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-1.5 text-xs">
          <p className="text-paper/80">Serving AP · Telangana · Bangalore · Chennai — DSA tie-ups with 30+ banks &amp; NBFCs</p>
          <div className="flex items-center gap-5">
            <Link href="/free-cibil-score" className="flex items-center gap-1.5 text-paper/90 hover:text-mint">
              <TrendingUp className="h-3.5 w-3.5" /> Check CIBIL Score
            </Link>
            <a href={`mailto:${site.email}`} className="text-paper/90 hover:text-mint">
              {site.email}
            </a>
          </div>
        </div>
      </div>

      <nav className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-5 py-3 sm:px-6" aria-label="Primary">
        <Link href="/" aria-label="LoanServ home" className="shrink-0">
          <Logo />
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-1 lg:flex" onMouseLeave={leave}>
          {megaMenus.map((menu, index) => {
            const isOpen = openMenu === menu.label;
            const panelId = `mega-menu-${menu.label.replace(/\s+/g, "-").toLowerCase()}`;
            const alignRight = index >= megaMenus.length - 2;
            return (
            <li
              key={menu.label}
              onMouseEnter={() => enter(menu.label)}
              onFocus={() => enter(menu.label)}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node | null)) leave();
              }}
              onKeyDown={(e) => {
                if (e.key === "Escape" && isOpen) {
                  setOpenMenu(null);
                  (e.currentTarget.querySelector("button[aria-controls]") as HTMLElement | null)?.focus();
                }
              }}
              className="relative"
            >
              <div
                className={cn(
                  "flex items-center rounded-lg text-sm font-medium text-slate transition-colors hover:text-evergreen",
                  isOpen && "text-evergreen",
                )}
              >
                <Link href={menu.href} className="rounded-lg py-2 pl-3 pr-1">
                  {menu.label}
                </Link>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  aria-label={`Toggle ${menu.label} submenu`}
                  onClick={() => setOpenMenu((o) => (o === menu.label ? null : menu.label))}
                  className="rounded-lg py-2 pl-1 pr-3"
                >
                  <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", isOpen && "rotate-180")} />
                </button>
              </div>

              {isOpen && (
                <div
                  id={panelId}
                  className={cn("absolute top-full pt-3", alignRight ? "right-0" : "left-0")}
                  onMouseEnter={() => enter(menu.label)}
                >
                  <div className="w-[min(90vw,760px)] rounded-2xl border border-sand bg-white p-5 shadow-lift">
                    <div className={cn("grid gap-6", menu.columns.length === 3 ? "grid-cols-3" : "grid-cols-2")}>
                      {menu.columns.map((col) => (
                        <div key={col.heading}>
                          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            {col.heading}
                          </p>
                          <ul className="space-y-0.5">
                            {col.links.map((l) => (
                              <li key={l.href}>
                                <Link
                                  href={l.href}
                                  className="block rounded-lg px-2 py-1.5 text-sm text-slate transition-colors hover:bg-paper hover:text-evergreen"
                                  onClick={() => setOpenMenu(null)}
                                >
                                  <span className="font-medium">{l.label}</span>
                                  {l.desc && <span className="block text-xs text-muted-foreground">{l.desc}</span>}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                    {menu.featured && (
                      <div className="mt-4 flex items-center justify-between gap-4 rounded-xl bg-ink px-4 py-3 text-paper">
                        <div>
                          <p className="font-display text-sm font-semibold">{menu.featured.title}</p>
                          <p className="text-xs text-paper/75">{menu.featured.desc}</p>
                        </div>
                        <Link href={menu.featured.href} onClick={() => setOpenMenu(null)}>
                          <Button variant="primary" size="sm">
                            {menu.featured.cta}
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href={`tel:+91${site.whatsapp.slice(-10)}`}
            className="hidden items-center gap-1.5 rounded-lg px-2 py-2 text-sm font-medium text-slate hover:text-evergreen xl:flex"
          >
            <Phone className="h-4 w-4" /> Call
          </a>
          <ApplyButton size="md" className="hidden sm:inline-flex" />
          <button
            ref={menuToggleRef}
            className="grid h-10 w-10 place-items-center rounded-lg text-ink lg:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile nav */}
      {mobileOpen && (
        <div id="mobile-nav" className="border-t border-sand bg-paper lg:hidden">
          <div className="max-h-[70vh] overflow-y-auto px-5 py-4">
            <MobileNav onNavigate={() => setMobileOpen(false)} />
            <div className="mt-4">
              <ApplyButton size="lg" className="w-full" />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function MobileNav({ onNavigate }: { onNavigate: () => void }) {
  const [open, setOpen] = React.useState<string | null>(null);
  return (
    <ul className="space-y-1">
      {megaMenus.map((menu) => (
        <li key={menu.label} className="border-b border-sand/70">
          <button
            className="flex w-full items-center justify-between py-3 text-left font-medium text-ink"
            onClick={() => setOpen((o) => (o === menu.label ? null : menu.label))}
            aria-expanded={open === menu.label}
          >
            {menu.label}
            <ChevronDown className={cn("h-4 w-4 transition-transform", open === menu.label && "rotate-180")} />
          </button>
          {open === menu.label && (
            <div className="pb-3">
              {menu.columns.map((col) => (
                <div key={col.heading} className="mb-2">
                  <p className="px-1 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {col.heading}
                  </p>
                  {col.links.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      onClick={onNavigate}
                      className="block rounded-lg px-2 py-2 text-sm text-slate hover:bg-white"
                    >
                      {l.label}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          )}
        </li>
      ))}
      <li className="pt-2">
        <Link href="/free-cibil-score" onClick={onNavigate} className="block py-2 text-sm font-medium text-evergreen">
          Check Free CIBIL Score →
        </Link>
      </li>
    </ul>
  );
}
