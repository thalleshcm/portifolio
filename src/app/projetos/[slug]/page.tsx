// src/app/projetos/[slug]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import SiteLayout from "@/components/layout/SiteLayout";
import { PROJECT_TYPE_LABELS } from "@/types";
import type { Metadata } from "next";

interface Props {
  params: { slug: string };
}

function parseProject(p: any) {
  return { ...p, tags: JSON.parse(p.tags || "[]"), extraMedia: p.extraMedia || [] };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await prisma.project.findUnique({ where: { slug: params.slug } });
  if (!project) return { title: "Projeto não encontrado" };
  return {
    title: project.title,
    description: project.description?.slice(0, 160) || undefined,
  };
}

export default async function ProjectPage({ params }: Props) {
  const raw = await prisma.project.findUnique({
    where: { slug: params.slug },
    include: { extraMedia: { orderBy: { order: "asc" } } },
  });
  if (!raw) notFound();

  const project = parseProject(raw);

  // Navegação anterior / próximo
  const [prev, next] = await Promise.all([
    prisma.project.findFirst({
      where: { createdAt: { lt: raw.createdAt } },
      orderBy: { createdAt: "desc" },
      select: { slug: true, title: true },
    }),
    prisma.project.findFirst({
      where: { createdAt: { gt: raw.createdAt } },
      orderBy: { createdAt: "asc" },
      select: { slug: true, title: true },
    }),
  ]);

  const isVideo = project.mainMediaType === "VIDEO";
  const date = new Date(project.projectDate).toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });

  return (
    <SiteLayout>
      <article className="max-w-5xl mx-auto px-6 pt-32 pb-24">
        {/* Voltar */}
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-2 text-text-secondary hover:text-accent text-sm transition-colors mb-10 group"
        >
          <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Voltar ao portfólio
        </Link>

        {/* Cabeçalho */}
        <header className="mb-10">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-full bg-accent/10 text-accent border border-accent/20"
              style={{ fontFamily: "var(--font-syne)" }}
            >
              {PROJECT_TYPE_LABELS[project.type]}
            </span>
            <span className="text-text-muted text-sm">{date}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight mb-3">
            {project.title}
          </h1>
          {project.subtitle && (
            <p className="text-text-secondary text-xl">{project.subtitle}</p>
          )}
        </header>

        {/* Mídia principal */}
        {project.mainMediaUrl && (
          <div className="relative rounded-2xl overflow-hidden bg-bg-card border border-border mb-12">
            {isVideo ? (
              <video
                src={project.mainMediaUrl}
                controls
                className="w-full max-h-[70vh] object-contain"
              />
            ) : (
              <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
                <Image
                  src={project.mainMediaUrl}
                  alt={project.title}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            )}
          </div>
        )}

        {/* Corpo */}
        <div className="grid md:grid-cols-3 gap-12">
          {/* Descrição + galeria */}
          <div className="md:col-span-2">
            {project.description && (
              <>
                <h2 className="font-display font-bold text-xl mb-4">Sobre o projeto</h2>
                <div className="text-text-secondary leading-relaxed whitespace-pre-wrap">
                  {project.description}
                </div>
              </>
            )}

            {/* Galeria extra */}
            {project.extraMedia.length > 0 && (
              <div className="mt-12">
                <h2 className="font-display font-bold text-xl mb-6">Galeria</h2>
                <div className="grid grid-cols-2 gap-4">
                  {project.extraMedia.map((m: any) => (
                    <div
                      key={m.id}
                      className="relative aspect-[4/3] rounded-xl overflow-hidden bg-bg-elevated border border-border"
                    >
                      {m.type === "VIDEO" ? (
                        <video src={m.url} controls className="w-full h-full object-cover" />
                      ) : (
                        <Image
                          src={m.url}
                          alt=""
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-500"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            {project.tags.length > 0 && (
              <div>
                <h3 className="font-display font-semibold text-sm text-text-muted uppercase tracking-wider mb-3">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="text-xs px-3 py-1.5 rounded-full bg-bg-elevated border border-border text-text-secondary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {project.externalUrl && (
              <div>
                <h3 className="font-display font-semibold text-sm text-text-muted uppercase tracking-wider mb-3">
                  Links
                </h3>
                <a
                  href={project.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline text-sm block text-center"
                >
                  Ver no Instagram ↗
                </a>
              </div>
            )}
          </aside>
        </div>

        {/* Navegação prev / next */}
        <nav className="grid grid-cols-2 gap-4 mt-16 pt-10 border-t border-border">
          {prev ? (
            <Link
              href={`/projetos/${prev.slug}`}
              className="group p-4 rounded-xl border border-border hover:border-accent/40 transition-all"
            >
              <p className="text-text-muted text-xs mb-1">← Anterior</p>
              <p className="font-display font-semibold text-sm group-hover:text-accent transition-colors line-clamp-2">
                {prev.title}
              </p>
            </Link>
          ) : <div />}
          {next && (
            <Link
              href={`/projetos/${next.slug}`}
              className="group p-4 rounded-xl border border-border hover:border-accent/40 transition-all text-right"
            >
              <p className="text-text-muted text-xs mb-1">Próximo →</p>
              <p className="font-display font-semibold text-sm group-hover:text-accent transition-colors line-clamp-2">
                {next.title}
              </p>
            </Link>
          )}
        </nav>
      </article>
    </SiteLayout>
  );
}
