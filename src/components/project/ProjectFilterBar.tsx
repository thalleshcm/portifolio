// src/components/project/ProjectFilterBar.tsx
"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import clsx from "clsx";
import type { ProjectType } from "@/types";
import { PROJECT_TYPE_LABELS } from "@/types";

const FILTER_OPTIONS: { value: "ALL" | ProjectType; label: string }[] = [
  { value: "ALL", label: "Todos" },
  ...Object.entries(PROJECT_TYPE_LABELS).map(([value, label]) => ({
    value: value as ProjectType,
    label,
  })),
];

export default function ProjectFilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const activeType = searchParams.get("type") ?? "ALL";

  function updateFilters(type?: string, q?: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (type !== undefined) {
      type === "ALL" ? params.delete("type") : params.set("type", type);
    }
    if (q !== undefined) {
      q ? params.set("q", q) : params.delete("q");
    }
    params.delete("page");
    startTransition(() => router.push(`${pathname}?${params.toString()}`));
  }

  return (
    <div className="flex flex-col gap-4 mb-10">
      {/* Filtros de categoria */}
      <div className="flex flex-wrap gap-2">
        {FILTER_OPTIONS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => updateFilters(value)}
            className={clsx(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border",
              "focus:outline-none focus:ring-2 focus:ring-accent/30",
              activeType === value
                ? "bg-accent text-bg-base border-accent"
                : "border-border text-text-secondary hover:border-accent/40 hover:text-text-primary"
            )}
            style={{ fontFamily: "var(--font-syne)" }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Campo de busca */}
      <div className="relative max-w-md">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Buscar projetos..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            updateFilters(undefined, e.target.value);
          }}
          className="input-field pl-10 py-2.5 text-sm"
        />
      </div>
    </div>
  );
}
