// src/app/contato/page.tsx
"use client";
import { useState } from "react";
import SiteLayout from "@/components/layout/SiteLayout";
import type { Metadata } from "next";

const PROJECT_TYPES = [
  "Design Gráfico / Identidade Visual",
  "Social Media",
  "Edição de Vídeo",
  "Motion Graphics",
  "Branding Completo",
  "Outro",
];

export default function ContatoPage() {
  const [form, setForm] = useState({ name: "", email: "", projectType: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Nome é obrigatório";
    if (!form.email.trim()) e.email = "E-mail é obrigatório";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "E-mail inválido";
    if (!form.message.trim()) e.message = "Mensagem é obrigatória";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setStatus("loading");
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setStatus(res.ok ? "success" : "error");
  }

  if (status === "success") {
    return (
      <SiteLayout>
        <div className="max-w-lg mx-auto px-6 pt-48 pb-24 text-center">
          <div className="w-20 h-20 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-4xl font-display font-bold mb-4">Mensagem enviada!</h2>
          <p className="text-text-secondary">Obrigado pelo contato. Retorno em breve.</p>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div className="max-w-2xl mx-auto px-6 pt-32 pb-24">
        <span className="section-tag mb-6 block">Contato</span>
        <h1 className="text-5xl font-display font-bold mb-3">Vamos conversar</h1>
        <p className="text-text-secondary mb-12">Conte sobre seu projeto e entrarei em contato.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Nome *</label>
              <input type="text" placeholder="Seu nome"
                value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className={`input-field ${errors.name ? "border-red-500/60" : ""}`} />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">E-mail *</label>
              <input type="email" placeholder="seu@email.com"
                value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className={`input-field ${errors.email ? "border-red-500/60" : ""}`} />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Tipo de projeto</label>
            <select value={form.projectType} onChange={e => setForm(f => ({ ...f, projectType: e.target.value }))}
              className="input-field">
              <option value="">Selecione...</option>
              {PROJECT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Mensagem *</label>
            <textarea rows={6} placeholder="Descreva seu projeto, prazo e orçamento estimado..."
              value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              className={`input-field resize-none ${errors.message ? "border-red-500/60" : ""}`} />
            {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}
          </div>

          <button type="submit" disabled={status === "loading"}
            className="btn-accent w-full py-4 disabled:opacity-60 disabled:cursor-not-allowed">
            {status === "loading" ? "Enviando..." : "Enviar mensagem"}
          </button>

          {status === "error" && (
            <p className="text-red-400 text-sm text-center">Erro ao enviar. Tente novamente.</p>
          )}
        </form>
      </div>
    </SiteLayout>
  );
}
