// src/app/portfolio/page.tsx
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import SiteLayout from "@/components/layout/SiteLayout";
import ProjectGrid from "@/components/project/ProjectGrid";
import ProjectFilterBar from "@/components/project/ProjectFilterBar";
import type { Metadata } from "next";
import type { ProjectType } from "@/types";

export const metadata: Metadata = { title: "Portfólio" };

const PAGE_SIZE = 16;

function parseProject(p: any) {
  return { ...p, tags: JSON.parse(p.tags || "[]"), extraMedia: p.extraMedia || [] };
}

interface PageProps {
  searchParams: { type?: string; q?: string; page?: string };
}

export default async function PortfolioPage({ searchParams }: PageProps) {
  const type = searchParams.type as ProjectType | undefined;
  const q = searchParams.q ?? "";
  const page = Math.max(1, parseInt(searchParams.page ?? "1"));

  const where: any = {
    ...(type && { type }),
    ...(q && {
      OR: [
        { title: { contains: q } },
        { tags: { contains: q } },
      ],
    }),
  };

  const [total, raw] = await Promise.all([
    prisma.project.count({ where }),
    prisma.project.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { extraMedia: true },
    }),
  ]);

  const projects = raw.map(parseProject);
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <SiteLayout>
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-24">
        <div className="mb-10">
          <span className="section-tag mb-3 block">Trabalhos</span>
          <h1 className="text-5xl font-display font-bold">Portfólio</h1>
          <p className="text-text-secondary mt-3 text-sm">
            {total} projeto{total !== 1 ? "s" : ""}
          </p>
        </div>

        <Suspense fallback={null}>
          <ProjectFilterBar />
        </Suspense>

        <ProjectGrid projects={projects} />

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => {
              const params = new URLSearchParams();
              if (type) params.set("type", type);
              if (q) params.set("q", q);
              if (n > 1) params.set("page", String(n));
              return (
                <a
                  key={n}
                  href={`/portfolio?${params.toString()}`}
                  className={`w-10 h-10 rounded-lg border flex items-center justify-center text-sm font-display transition-all
                    ${n === page
                      ? "bg-accent text-bg-base border-accent"
                      : "border-border text-text-secondary hover:border-accent/40 hover:text-text-primary"
                    }`}
                >
                  {n}
                </a>
              );
            })}
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
