// src/components/layout/Footer.tsx
import Link from "next/link";

const SOCIAL_LINKS = [
  { href: "https://instagram.com/seuusuario", label: "Instagram" },
  { href: "https://behance.net/seuusuario", label: "Behance" },
  { href: "https://youtube.com/@seucanal", label: "YouTube" },
];

const NAV_LINKS = [
  { href: "/portfolio", label: "Portfólio" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contato", label: "Contato" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border mt-24">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-accent rounded-sm flex items-center justify-center">
                <span className="text-bg-base font-display font-bold text-xs">SN</span>
              </div>
              <span className="font-display font-bold text-text-primary">Seu Nome</span>
            </Link>
            <p className="text-text-muted text-sm leading-relaxed">
              Designer gráfico & videomaker criando experiências visuais que transformam marcas.
            </p>
          </div>

          {/* Nav */}
          <div>
            <h4 className="font-display font-semibold text-sm text-text-muted uppercase tracking-wider mb-4">
              Navegação
            </h4>
            <ul className="space-y-2">
              {NAV_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-text-secondary text-sm hover:text-accent transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-display font-semibold text-sm text-text-muted uppercase tracking-wider mb-4">
              Redes Sociais
            </h4>
            <div className="flex flex-col gap-2">
              {SOCIAL_LINKS.map(({ href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-secondary text-sm hover:text-accent transition-colors inline-flex items-center gap-2"
                >
                  <span className="text-accent">↗</span>
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-border/60 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-text-muted text-sm">
            © {year} Seu Nome. Todos os direitos reservados.
          </p>
          <p className="text-text-muted text-xs">
            Feito com Next.js + Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
