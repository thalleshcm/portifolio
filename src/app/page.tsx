// src/app/page.tsx — Home
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import SiteLayout from "@/components/layout/SiteLayout";
import ProjectCard from "@/components/project/ProjectCard";
import type { Metadata } from "next";
import type { Project } from "@/types";

export const metadata: Metadata = {
  title: "Seu Nome — Designer Gráfico & Videomaker",
};

function parseProject(p: any): Project {
  return { ...p, tags: JSON.parse(p.tags || "[]"), extraMedia: p.extraMedia || [] };
}

export default async function HomePage() {
  const raw = await prisma.project.findMany({
    where: { featured: true },
    orderBy: { createdAt: "desc" },
    take: 8,
    include: { extraMedia: true },
  });
  const projects: Project[] = raw.map(parseProject);

  return (
    <SiteLayout>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Decoração de fundo */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                "linear-gradient(#CBFF47 1px,transparent 1px),linear-gradient(90deg,#CBFF47 1px,transparent 1px)",
              backgroundSize: "80px 80px",
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-32 pt-40">
          <div className="max-w-3xl">
            <span className="section-tag mb-6 block">Portfolio</span>
            <h1 className="text-6xl md:text-8xl font-display font-extrabold leading-none tracking-tight mb-6">
              Designer<br />
              <span className="text-accent">Gráfico</span> &<br />
              Videomaker
            </h1>
            <p className="text-text-secondary text-xl leading-relaxed mb-10 max-w-xl">
              Criando identidades visuais, social media e vídeos que transformam marcas em experiências memoráveis.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/portfolio" className="btn-accent text-base px-8 py-4">
                Ver Portfólio →
              </Link>
              <Link href="/contato" className="btn-outline text-base px-8 py-4">
                Fale Comigo
              </Link>
            </div>

            {/* Stats — edite os números conforme sua realidade */}
            <div className="flex gap-10 mt-16 pt-10 border-t border-border/60">
              {[
                { n: "50+", label: "Projetos" },
                { n: "30+", label: "Clientes" },
                { n: "5+", label: "Anos" },
              ].map(({ n, label }) => (
                <div key={label}>
                  <p className="text-4xl font-display font-bold text-accent">{n}</p>
                  <p className="text-text-muted text-sm mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Destaques ────────────────────────────────────────────── */}
      {projects.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 pb-24">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="section-tag mb-3 block">Projetos</span>
              <h2 className="text-4xl font-display font-bold">Trabalhos em Destaque</h2>
            </div>
            <Link href="/portfolio" className="btn-outline text-sm hidden md:inline-block">
              Ver todos →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {projects.map((p: Project, i: number) => (
              <ProjectCard key={p.id} project={p} priority={i < 4} />
            ))}
          </div>
          <div className="mt-8 text-center md:hidden">
            <Link href="/portfolio" className="btn-outline text-sm">Ver todos os projetos →</Link>
          </div>
        </section>
      )}

      {/* ── Serviços ─────────────────────────────────────────────── */}
      {/* Para editar: altere o array abaixo com seus serviços reais */}
      <section className="border-t border-border py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="section-tag mb-3 inline-flex">Serviços</span>
            <h2 className="text-4xl font-display font-bold mt-2">O que eu faço</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: "✦", title: "Design Gráfico", desc: "Identidades visuais, logotipos e materiais que comunicam a essência da sua marca." },
              { icon: "◈", title: "Social Media", desc: "Conteúdo visual estratégico para Instagram, TikTok e outras plataformas." },
              { icon: "▷", title: "Edição de Vídeo", desc: "Cortes, colorização e pós-produção para reels, YouTube e publicidade." },
              { icon: "◎", title: "Motion Graphics", desc: "Animações e vinhetas que dão vida à sua marca em movimento." },
              { icon: "◆", title: "Branding", desc: "Desenvolvimento completo de marca: naming, guia visual e aplicações." },
              { icon: "✧", title: "Consultoria", desc: "Orientação estratégica para posicionar sua marca no mercado digital." },
            ].map(({ icon, title, desc }) => (
              <div
                key={title}
                className="p-6 rounded-xl border border-border bg-bg-card card-hover group"
              >
                <span className="text-3xl text-accent mb-4 block">{icon}</span>
                <h3 className="font-display font-bold text-lg mb-2 group-hover:text-accent transition-colors">
                  {title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Final ────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-5xl font-display font-bold mb-6">
            Vamos criar algo<br />
            <span className="text-accent">incrível juntos?</span>
          </h2>
          <p className="text-text-secondary text-lg mb-10">
            Entre em contato e vamos conversar sobre o seu projeto.
          </p>
          <Link href="/contato" className="btn-accent text-lg px-10 py-4">
            Solicitar Orçamento
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
