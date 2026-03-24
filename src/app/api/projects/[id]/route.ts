// src/app/api/projects/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadFile, getMediaType, deleteFile } from "@/lib/upload";
import { generateSlug } from "@/lib/slugify";
import { getAdminSession } from "@/lib/auth";

export const dynamic = 'force-dynamic';

interface Ctx { params: { id: string } }

// GET /api/projects/:id
export async function GET(_: NextRequest, { params }: Ctx) {
  const id = parseInt(params.id);
  if (isNaN(id)) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

  const project = await prisma.project.findUnique({
    where: { id },
    include: { extraMedia: true },
  });
  if (!project) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });

  return NextResponse.json({ ...project, tags: JSON.parse(project.tags || "[]") });
}

// PUT /api/projects/:id — edita (requer auth)
export async function PUT(req: NextRequest, { params }: Ctx) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const id = parseInt(params.id);
  if (isNaN(id)) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

  const existing = await prisma.project.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });

  const fd = await req.formData();

  // Atualiza mídia principal se nova for enviada
  let mainMediaUrl = existing.mainMediaUrl;
  let mainMediaType = existing.mainMediaType;
  const mainFile = fd.get("mainMedia") as File | null;
  if (mainFile && mainFile.size > 0) {
    await deleteFile(existing.mainMediaUrl);
    mainMediaUrl = await uploadFile(mainFile);
    mainMediaType = getMediaType(mainFile.name) as "IMAGE" | "VIDEO";
  }

  const tagsRaw = (fd.get("tags") as string) || "";
  const tags = JSON.stringify(tagsRaw.split(",").map(t => t.trim()).filter(Boolean));

  const rawSlug = (fd.get("slug") as string)?.trim() || existing.slug;
  const slug = generateSlug(rawSlug);

  if (slug !== existing.slug) {
    const conflict = await prisma.project.findUnique({ where: { slug } });
    if (conflict) return NextResponse.json({ error: "Slug já existe" }, { status: 409 });
  }

  const updated = await prisma.project.update({
    where: { id },
    data: {
      slug,
      title: (fd.get("title") as string)?.trim() || existing.title,
      subtitle: (fd.get("subtitle") as string)?.trim() || null,
      type: (fd.get("type") as any) || existing.type,
      description: (fd.get("description") as string) || "",
      tags,
      mainMediaUrl,
      mainMediaType,
      externalUrl: (fd.get("externalUrl") as string)?.trim() || null,
      featured: fd.get("featured") === "true",
      projectDate: new Date((fd.get("projectDate") as string) || existing.projectDate),
    },
    include: { extraMedia: true },
  });

  // Adiciona novas mídias extras (não remove as antigas — gerencie no painel se necessário)
  const extras = fd.getAll("extraMedia") as File[];
  const currentCount = updated.extraMedia.length;
  for (let i = 0; i < extras.length; i++) {
    const f = extras[i];
    if (!f || f.size === 0) continue;
    const url = await uploadFile(f);
    await prisma.media.create({
      data: { url, type: getMediaType(f.name), order: currentCount + i, projectId: id },
    });
  }

  const full = await prisma.project.findUnique({
    where: { id },
    include: { extraMedia: true },
  });

  return NextResponse.json({ ...full, tags: JSON.parse(full!.tags || "[]") });
}

// DELETE /api/projects/:id — exclui (requer auth)
export async function DELETE(_: NextRequest, { params }: Ctx) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const id = parseInt(params.id);
  if (isNaN(id)) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

  const project = await prisma.project.findUnique({
    where: { id },
    include: { extraMedia: true },
  });
  if (!project) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });

  // Remove arquivos locais em dev
  await deleteFile(project.mainMediaUrl);
  for (const m of project.extraMedia) await deleteFile(m.url);

  // Cascade no schema remove as Media relacionadas
  await prisma.project.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
