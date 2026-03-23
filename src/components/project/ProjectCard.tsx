// src/components/project/ProjectCard.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import type { Project } from "@/types";
import { PROJECT_TYPE_LABELS, PROJECT_TYPE_COLORS } from "@/types";

interface ProjectCardProps {
  project: Project;
  priority?: boolean;
}

export default function ProjectCard({ project, priority = false }: ProjectCardProps) {
  const isVideo = project.mainMediaType === "VIDEO";
  const hasMedia = Boolean(project.mainMediaUrl);

  return (
    <Link
      href={`/projetos/${project.slug}`}
      className="group relative block overflow-hidden rounded-xl border border-border bg-bg-card card-hover"
    >
      {/* Thumbnail */}
      <div className="relative aspect-[4/3] overflow-hidden bg-bg-elevated">
        {hasMedia ? (
          isVideo ? (
            <video
              src={project.mainMediaUrl}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              muted
              playsInline
              preload="metadata"
            />
          ) : (
            <Image
              src={project.mainMediaUrl}
              alt={project.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              priority={priority}
            />
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-muted opacity-30">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {/* Overlay de hover com tags */}
        <div className="absolute inset-0 bg-gradient-to-t from-bg-base/90 via-bg-base/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-block text-xs text-text-secondary bg-bg-base/70 border border-border/60 rounded px-2 py-0.5 mr-1 mb-1"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Ícone de vídeo */}
        {isVideo && (
          <div className="absolute top-3 right-3 w-8 h-8 bg-bg-base/70 rounded-full flex items-center justify-center backdrop-blur-sm">
            <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        )}

        {/* Badge destaque */}
        {project.featured && (
          <div
            className="absolute top-3 left-3 px-2 py-0.5 bg-accent text-bg-base text-xs font-semibold rounded"
            style={{ fontFamily: "var(--font-syne)" }}
          >
            Destaque
          </div>
        )}
      </div>

      {/* Rodapé do card */}
      <div className="p-4">
        <h3
          className="text-text-primary font-semibold text-sm leading-snug line-clamp-2 group-hover:text-accent transition-colors duration-200 mb-2"
          style={{ fontFamily: "var(--font-syne)" }}
        >
          {project.title}
        </h3>
        <span
          className={clsx(
            "inline-block text-xs font-medium px-2 py-0.5 rounded border",
            PROJECT_TYPE_COLORS[project.type]
          )}
        >
          {PROJECT_TYPE_LABELS[project.type]}
        </span>
      </div>
    </Link>
  );
}
