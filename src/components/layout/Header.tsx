// src/components/layout/Header.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const NAV_LINKS = [
  { href: "/portfolio", label: "Portfólio" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contato", label: "Contato" },
];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header
      className={clsx(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-bg-base/90 backdrop-blur-xl border-b border-border/60 py-4"
          : "bg-transparent py-6"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="w-8 h-8 bg-accent rounded-sm flex items-center justify-center">
            <span className="text-bg-base font-display font-bold text-xs leading-none">SN</span>
          </div>
          <span
            className="font-display font-bold text-lg text-text-primary group-hover:text-accent transition-colors duration-200"
          >
            Seu Nome
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={clsx(
                "text-sm font-medium tracking-wide transition-colors duration-200 relative py-1",
                "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-accent",
                "after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100",
                pathname.startsWith(href)
                  ? "text-accent after:scale-x-100"
                  : "text-text-secondary hover:text-text-primary"
              )}
              style={{ fontFamily: "var(--font-syne)" }}
            >
              {label}
            </Link>
          ))}
          <Link href="/contato" className="btn-accent text-sm py-2 px-5">
            Orçamento
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Menu"
        >
          <span className={clsx("block w-6 h-px bg-text-primary transition-all duration-300", open && "rotate-45 translate-y-2")} />
          <span className={clsx("block w-6 h-px bg-text-primary transition-all duration-300", open && "opacity-0")} />
          <span className={clsx("block w-6 h-px bg-text-primary transition-all duration-300", open && "-rotate-45 -translate-y-2")} />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={clsx(
          "md:hidden overflow-hidden transition-all duration-300",
          open ? "max-h-64 border-t border-border/60" : "max-h-0"
        )}
      >
        <nav className="flex flex-col gap-1 px-6 py-4 bg-bg-base/95 backdrop-blur-xl">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={clsx(
                "py-3 text-sm font-medium border-b border-border/40 last:border-0",
                pathname.startsWith(href) ? "text-accent" : "text-text-secondary"
              )}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/contato"
            className="btn-accent text-sm py-2 text-center mt-2"
            onClick={() => setOpen(false)}
          >
            Orçamento
          </Link>
        </nav>
      </div>
    </header>
  );
}
