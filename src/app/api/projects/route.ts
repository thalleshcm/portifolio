// src/app/api/projects/route.ts
import { NextRequest, NextResponse } from "next/server";
import type { Project } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { uploadFile, getMediaType } from "@/lib/upload";
import { generateSlug } from "@/lib/slugify";
import { getAdminSession } from "@/lib/auth";

// GET /api/projects — listagem pública com filtros e paginação
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const type = sp.get("type") || undefined;
  const q = sp.get("q") || undefined;
  const featured = sp.get("featured");
  const page = Math.max(1, parseInt(sp.get("page") || "1"));
  const limit = Math.min(50, parseInt(sp.get("limit") || "16"));

  const where: Record<string, unknown> = {};
  if (type) where.type = type;
  if (featured === "true") where.featured = true;
  if (q) where.OR = [{ title: { contains: q } }, { tags: { contains: q } }];

  const [total, projects] = await Promise.all([
    prisma.project.count({ where }),
    prisma.project.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: { extraMedia: true },
    }),
  ]);

  return NextResponse.json({
    projects: projects.map((p: Project) => ({ ...p, tags: JSON.parse(p.tags || "[]") })),
    total,
    page,
    pages: Math.ceil(total / limit),
  });
}

// POST /api/projects — cria novo projeto (requer auth)
export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const fd = await req.formData();

  const title = (fd.get("title") as string)?.trim();
  if (!title) return NextResponse.json({ error: "Título obrigatório" }, { status: 400 });

  const rawSlug = (fd.get("slug") as string)?.trim() || generateSlug(title);
  const slug = generateSlug(rawSlug);

  const existing = await prisma.project.findUnique({ where: { slug } });
  if (existing) return NextResponse.json({ error: "Slug já existe. Escolha outro." }, { status: 409 });

  // Upload mídia principal
  let mainMediaUrl = "";
  let mainMediaType: "IMAGE" | "VIDEO" = "IMAGE";
  const mainFile = fd.get("mainMedia") as File | null;
  if (mainFile && mainFile.size > 0) {
    mainMediaUrl = await uploadFile(mainFile);
    mainMediaType = getMediaType(mainFile.name);
  }

  const tagsRaw = (fd.get("tags") as string) || "";
  const tags = JSON.stringify(tagsRaw.split(",").map(t => t.trim()).filter(Boolean));

  const project = await prisma.project.create({
    data: {
      slug,
      title,
      subtitle: (fd.get("subtitle") as string)?.trim() || null,
      type: (fd.get("type") as any) || "DESIGN",
      description: (fd.get("description") as string) || "",
      tags,
      mainMediaUrl,
      mainMediaType,
      externalUrl: (fd.get("externalUrl") as string)?.trim() || null,
      featured: fd.get("featured") === "true",
      projectDate: new Date((fd.get("projectDate") as string) || Date.now()),
    },
  });

  // Upload mídias extras
  const extras = fd.getAll("extraMedia") as File[];
  for (let i = 0; i < extras.length; i++) {
    const f = extras[i];
    if (!f || f.size === 0) continue;
    const url = await uploadFile(f);
    await prisma.media.create({
      data: { url, type: getMediaType(f.name), order: i, projectId: project.id },
    });
  }

  const full = await prisma.project.findUnique({
    where: { id: project.id },
    include: { extraMedia: true },
  });

  return NextResponse.json(
    { ...full, tags: JSON.parse(full!.tags || "[]") },
    { status: 201 }
  );
}
