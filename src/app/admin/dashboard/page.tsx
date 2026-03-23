// src/app/admin/dashboard/page.tsx
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Project } from "@/types";
import { PROJECT_TYPE_LABELS } from "@/types";

export default function Dashboard() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  useEffect(() => { fetchProjects(); }, []);

  async function fetchProjects() {
    const res = await fetch("/api/projects?limit=100");
    const data = await res.json();
    setProjects(data.projects || []);
    setLoading(false);
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  async function handleDelete(id: number) {
    setDeleting(id);
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    setProjects(ps => ps.filter(p => p.id !== id));
    setDeleting(null);
    setConfirmDelete(null);
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border bg-bg-card sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-accent rounded-sm flex items-center justify-center">
              <span className="text-bg-base font-display font-bold text-xs">SN</span>
            </div>
            <span className="font-display font-semibold">Painel Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-text-secondary text-sm hover:text-accent transition-colors">← Ver site</Link>
            <button onClick={handleLogout} className="text-text-secondary text-sm hover:text-red-400 transition-colors">Sair</button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold">Projetos</h1>
            <p className="text-text-secondary text-sm mt-1">{projects.length} projeto(s) cadastrado(s)</p>
          </div>
          <Link href="/admin/projetos/novo" className="btn-accent text-sm py-2.5 px-5">+ Novo Projeto</Link>
        </div>

        {loading ? (
          <div className="text-center py-20 text-text-secondary">Carregando...</div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border rounded-2xl">
            <p className="text-text-secondary mb-4">Nenhum projeto ainda.</p>
            <Link href="/admin/projetos/novo" className="btn-accent text-sm">Criar primeiro projeto</Link>
          </div>
        ) : (
          <div className="border border-border rounded-xl overflow-hidden overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-bg-elevated border-b border-border">
                <tr>
                  {["Título", "Tipo", "Destaque", "Data", "Ações"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-text-muted font-semibold text-xs uppercase tracking-wider"
                      style={{ fontFamily: "var(--font-syne)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {projects.map(p => (
                  <tr key={p.id} className="hover:bg-bg-elevated transition-colors">
                    <td className="px-4 py-4">
                      <p className="font-medium text-text-primary line-clamp-1">{p.title}</p>
                      <p className="text-text-muted text-xs mt-0.5">/{p.slug}</p>
                    </td>
                    <td className="px-4 py-4 text-text-secondary text-xs">{PROJECT_TYPE_LABELS[p.type]}</td>
                    <td className="px-4 py-4">
                      {p.featured
                        ? <span className="text-xs text-accent">✦ Sim</span>
                        : <span className="text-xs text-text-muted">—</span>}
                    </td>
                    <td className="px-4 py-4 text-text-secondary text-xs">
                      {new Date(p.projectDate).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/projetos/${p.id}/editar`}
                          className="text-xs px-3 py-1.5 border border-border rounded hover:border-accent/40 hover:text-accent transition-all">
                          Editar
                        </Link>
                        <button onClick={() => setConfirmDelete(p.id)}
                          className="text-xs px-3 py-1.5 border border-border rounded hover:border-red-500/40 hover:text-red-400 transition-all">
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de confirmação */}
      {confirmDelete !== null && (
        <div className="fixed inset-0 bg-bg-base/80 backdrop-blur-sm flex items-center justify-center z-50 px-6">
          <div className="bg-bg-card border border-border rounded-2xl p-8 max-w-sm w-full">
            <h3 className="font-display font-bold text-xl mb-3">Excluir projeto?</h3>
            <p className="text-text-secondary text-sm mb-8">Esta ação não pode ser desfeita. O projeto e todos os seus arquivos serão removidos.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="btn-outline text-sm py-2.5 flex-1">Cancelar</button>
              <button onClick={() => handleDelete(confirmDelete)} disabled={deleting === confirmDelete}
                className="flex-1 py-2.5 text-sm rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all disabled:opacity-60">
                {deleting === confirmDelete ? "Excluindo..." : "Excluir"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
