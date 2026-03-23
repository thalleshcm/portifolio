// src/components/admin/ProjectForm.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Project, ProjectType } from "@/types";
import { PROJECT_TYPE_LABELS } from "@/types";

interface ProjectFormProps {
  initialData?: Partial<Project & { tags: string[] }>;
  projectId?: number;
}

function generateSlugSimple(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export default function ProjectForm({ initialData, projectId }: ProjectFormProps) {
  const router = useRouter();
  const isEdit = Boolean(projectId);

  const [form, setForm] = useState({
    title: initialData?.title ?? "",
    slug: initialData?.slug ?? "",
    subtitle: initialData?.subtitle ?? "",
    type: (initialData?.type ?? "DESIGN") as ProjectType,
    description: initialData?.description ?? "",
    tags: Array.isArray(initialData?.tags) ? initialData.tags.join(", ") : "",
    externalUrl: initialData?.externalUrl ?? "",
    featured: initialData?.featured ?? false,
    projectDate: initialData?.projectDate
      ? new Date(initialData.projectDate).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10),
  });

  const [mainFile, setMainFile] = useState<File | null>(null);
  const [extraFiles, setExtraFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleTitleChange(title: string) {
    setForm(f => ({
      ...f,
      title,
      slug: f.slug === generateSlugSimple(f.title) || f.slug === ""
        ? generateSlugSimple(title)
        : f.slug,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) { setError("Título é obrigatório"); return; }
    setLoading(true);
    setError("");

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
    if (mainFile) fd.append("mainMedia", mainFile);
    extraFiles.forEach(f => fd.append("extraMedia", f));

    const url = isEdit ? `/api/projects/${projectId}` : "/api/projects";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, { method, body: fd });

    if (res.ok) {
      router.push("/admin/dashboard");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Erro ao salvar projeto");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>
      )}

      {/* Informações básicas */}
      <section className="bg-bg-card border border-border rounded-xl p-6 space-y-5">
        <h2 className="font-display font-bold text-lg">Informações</h2>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">Título *</label>
          <input type="text" value={form.title} onChange={e => handleTitleChange(e.target.value)}
            placeholder="Ex.: Identidade Visual — Marca X" className="input-field" required />
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Slug</label>
            <input type="text" value={form.slug}
              onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
              placeholder="identidade-visual-marca-x" className="input-field font-mono text-sm" />
            <p className="text-text-muted text-xs mt-1">URL: /projetos/{form.slug || "..."}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Tipo *</label>
            <select value={form.type}
              onChange={e => setForm(f => ({ ...f, type: e.target.value as ProjectType }))}
              className="input-field">
              {Object.entries(PROJECT_TYPE_LABELS).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">Subtítulo</label>
          <input type="text" value={form.subtitle}
            onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))}
            placeholder="Ex.: Branding completo para empresa de tecnologia" className="input-field" />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">Descrição</label>
          <textarea rows={6} value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            placeholder="Descreva o projeto, desafios, processo criativo..."
            className="input-field resize-none" />
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Tags (separadas por vírgula)</label>
            <input type="text" value={form.tags}
              onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
              placeholder="branding, logo, identidade" className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Data do projeto</label>
            <input type="date" value={form.projectDate}
              onChange={e => setForm(f => ({ ...f, projectDate: e.target.value }))}
              className="input-field" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">Link externo (Instagram, YouTube, etc.)</label>
          <input type="url" value={form.externalUrl}
            onChange={e => setForm(f => ({ ...f, externalUrl: e.target.value }))}
            placeholder="https://instagram.com/p/..." className="input-field" />
        </div>

        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input type="checkbox" checked={form.featured}
            onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))}
            className="w-4 h-4 accent-[#CBFF47]" />
          <span className="text-sm text-text-secondary">Marcar como destaque na home</span>
        </label>
      </section>

      {/* Mídia */}
      <section className="bg-bg-card border border-border rounded-xl p-6 space-y-5">
        <h2 className="font-display font-bold text-lg">Mídia</h2>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Mídia principal {isEdit && <span className="text-text-muted">(deixe vazio para manter a atual)</span>}
          </label>
          <input type="file" accept="image/*,video/*"
            onChange={e => setMainFile(e.target.files?.[0] ?? null)}
            className="block w-full text-sm text-text-secondary
              file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0
              file:text-sm file:bg-accent/10 file:text-accent
              hover:file:bg-accent/20 cursor-pointer" />
          <p className="text-text-muted text-xs mt-1">Suporta: JPG, PNG, GIF, MP4, MOV, WEBM</p>
          {isEdit && initialData?.mainMediaUrl && (
            <p className="text-text-muted text-xs mt-1">Atual: <span className="text-text-secondary">{initialData.mainMediaUrl}</span></p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">Mídias extras (galeria)</label>
          <input type="file" accept="image/*,video/*" multiple
            onChange={e => setExtraFiles(Array.from(e.target.files ?? []))}
            className="block w-full text-sm text-text-secondary
              file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0
              file:text-sm file:bg-bg-elevated file:text-text-secondary
              hover:file:bg-border cursor-pointer" />
          {extraFiles.length > 0 && (
            <p className="text-text-muted text-xs mt-1">{extraFiles.length} arquivo(s) selecionado(s)</p>
          )}
        </div>
      </section>

      {/* Ações */}
      <div className="flex items-center gap-4 pb-10">
        <button type="submit" disabled={loading}
          className="btn-accent py-3 px-8 disabled:opacity-60 disabled:cursor-not-allowed">
          {loading ? "Salvando..." : isEdit ? "Salvar alterações" : "Criar projeto"}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-outline py-3 px-6">
          Cancelar
        </button>
      </div>
    </form>
  );
}
