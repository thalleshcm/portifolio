// src/app/sobre/page.tsx
// ── PERSONALIZE AQUI ────────────────────────────────────────────
// Edite os textos de bio, serviços e adicione sua foto real.
// Para a foto: coloque o arquivo em /public/foto-perfil.jpg e
// substitua o placeholder pelo componente Image abaixo:
//   import Image from "next/image";
//   <Image src="/foto-perfil.jpg" alt="Seu Nome" fill className="object-cover" />
// ──────────────────────────────────────────────────────────────

import SiteLayout from "@/components/layout/SiteLayout";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Sobre" };

// ── Edite estes dados ──
const BIO_PARAGRAPHS = [
  "Olá! Sou um designer gráfico e videomaker apaixonado por criar experiências visuais que deixam marcas. Com mais de 5 anos de experiência, trabalho com marcas de todos os tamanhos — desde startups até empresas consolidadas.",
  "Meu processo combina estratégia, estética e storytelling para entregar projetos que não apenas ficam bonitos, mas também comunicam com clareza e impactam o público certo.",
  "Quando não estou trabalhando, estou estudando novas tendências de design, experimentando técnicas de motion ou fotografando paisagens urbanas.",
];

const SERVICES = [
  "Design de identidade visual & branding",
  "Social media design (feed, stories, reels)",
  "Edição e pós-produção de vídeo",
  "Motion graphics e animações",
  "Consultoria de presença digital",
  "Materiais gráficos impressos e digitais",
];

const TOOLS = [
  "Adobe Photoshop",
  "Illustrator",
  "Premiere Pro",
  "After Effects",
  "Figma",
  "DaVinci Resolve",
];
// ──────────────────────────────────────────────────────────────

export default function SobrePage() {
  return (
    <SiteLayout>
      <div className="max-w-5xl mx-auto px-6 pt-32 pb-24">
        <span className="section-tag mb-6 block">Sobre</span>

        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Foto placeholder */}
          <div className="relative">
            <div className="aspect-[4/5] rounded-2xl bg-bg-elevated border border-border overflow-hidden relative">
              {/* Substitua por: <Image src="/foto-perfil.jpg" alt="Seu Nome" fill className="object-cover" /> */}
              <div className="w-full h-full flex items-center justify-center text-text-muted">
                <div className="text-center">
                  <div className="w-24 h-24 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl font-display font-bold text-accent">SN</span>
                  </div>
                  <p className="text-sm text-text-muted">Coloque sua foto aqui</p>
                  <p className="text-xs text-text-muted mt-1">/public/foto-perfil.jpg</p>
                </div>
              </div>
            </div>
            {/* Decorativo */}
            <div className="absolute -bottom-4 -right-4 w-32 h-32 border border-accent/20 rounded-2xl -z-10" />
          </div>

          {/* Bio */}
          <div>
            <h1 className="text-5xl font-display font-bold mb-2">Seu Nome</h1>
            <p
              className="text-accent font-medium mb-8"
              style={{ fontFamily: "var(--font-syne)" }}
            >
              Designer Gráfico & Videomaker
            </p>

            <div className="text-text-secondary leading-relaxed space-y-4">
              {BIO_PARAGRAPHS.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            {/* Serviços */}
            <div className="mt-10">
              <h2 className="font-display font-bold text-lg mb-5">O que ofereço</h2>
              <ul className="space-y-3">
                {SERVICES.map((s) => (
                  <li key={s} className="flex items-center gap-3 text-text-secondary text-sm">
                    <span className="text-accent flex-shrink-0">◆</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            {/* Ferramentas */}
            <div className="mt-10">
              <h2 className="font-display font-bold text-lg mb-5">Ferramentas</h2>
              <div className="flex flex-wrap gap-2">
                {TOOLS.map((t) => (
                  <span
                    key={t}
                    className="text-xs px-3 py-1.5 rounded-full bg-bg-elevated border border-border text-text-secondary"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="mt-10 pt-8 border-t border-border">
              <a href="/contato" className="btn-accent text-sm inline-block">
                Vamos trabalhar juntos →
              </a>
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
