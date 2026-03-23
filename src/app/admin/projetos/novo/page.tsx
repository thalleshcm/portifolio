// src/app/admin/projetos/novo/page.tsx
import Link from "next/link";
import ProjectForm from "@/components/admin/ProjectForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Novo Projeto — Admin" };

export default function NovoProjetoPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-bg-card sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/admin/dashboard"
            className="text-text-secondary hover:text-accent text-sm transition-colors">
            ← Voltar
          </Link>
          <h1 className="font-display font-bold text-xl">Novo Projeto</h1>
        </div>
      </header>
      <div className="max-w-4xl mx-auto px-6 py-10">
        <ProjectForm />
      </div>
    </div>
  );
}
