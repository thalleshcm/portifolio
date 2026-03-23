// src/app/admin/login/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) router.push("/admin/dashboard");
    else { setError("Credenciais inválidas"); setLoading(false); }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-bg-base font-display font-bold text-lg">SN</span>
          </div>
          <h1 className="text-3xl font-display font-bold">Admin</h1>
          <p className="text-text-secondary text-sm mt-1">Área restrita</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Usuário" value={form.username}
            onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
            className="input-field" required />
          <input type="password" placeholder="Senha" value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            className="input-field" required />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" disabled={loading}
            className="btn-accent w-full py-3 disabled:opacity-60">
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
