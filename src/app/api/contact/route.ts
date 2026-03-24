// src/app/api/contact/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// INTEGRAÇÃO DE E-MAIL — adicione aqui o SDK do seu provedor.
//
// Opção 1 — Resend (recomendado):
//   npm install resend
//   import { Resend } from 'resend';
//   const resend = new Resend(process.env.RESEND_API_KEY);
//   await resend.emails.send({
//     from: 'Portfolio <noreply@seudominio.com>',
//     to: 'voce@seudominio.com',
//     subject: `Novo contato: ${name}`,
//     html: `<p><b>Nome:</b> ${name}</p><p><b>Email:</b> ${email}</p><p>${message}</p>`,
//   });
//
// Opção 2 — SendGrid:
//   npm install @sendgrid/mail
//   import sgMail from '@sendgrid/mail';
//   sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
//   await sgMail.send({ to: '...', from: '...', subject: '...', html: '...' });
// ─────────────────────────────────────────────────────────────────────────────
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const { name, email, projectType, message } = await req.json();

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json({ error: "Campos obrigatórios faltando" }, { status: 400 });
  }

  // Simulação — substitua pelo envio real de e-mail
  console.log("📩 Novo contato:", { name, email, projectType, message });

  // TODO: adicionar integração com Resend / SendGrid aqui

  return NextResponse.json({ ok: true });
}
