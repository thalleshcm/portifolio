// src/lib/upload.ts
// ─────────────────────────────────────────────────────────────────────────────
// ABSTRAÇÃO DE UPLOAD DE ARQUIVOS
//
// DESENVOLVIMENTO: salva em /public/uploads (servido estaticamente pelo Next.js)
//
// PRODUÇÃO — COMO ADAPTAR:
//   Substitua o bloco dentro de uploadFile() pelo SDK do provedor desejado.
//
// Exemplo AWS S3:
//   import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
//   const s3 = new S3Client({ region: process.env.AWS_REGION });
//   await s3.send(new PutObjectCommand({
//     Bucket: process.env.AWS_S3_BUCKET, Key: filename,
//     Body: buffer, ContentType: file.type,
//   }));
//   return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}`;
//
// Exemplo Cloudinary:
//   import { v2 as cloudinary } from "cloudinary";
//   const b64 = buffer.toString("base64");
//   const result = await cloudinary.uploader.upload(`data:${file.type};base64,${b64}`);
//   return result.secure_url;
// ─────────────────────────────────────────────────────────────────────────────

import { writeFile, mkdir, unlink } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

async function ensureDir(): Promise<void> {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }
}

function genFilename(originalName: string): string {
  const ext = path.extname(originalName).toLowerCase();
  const timestamp = Date.now();
  const random = Math.random().toString(36).slice(2, 8);
  return `${timestamp}-${random}${ext}`;
}

export function getMediaType(filename: string): "IMAGE" | "VIDEO" {
  const ext = path.extname(filename).toLowerCase();
  const videoExts = [".mp4", ".mov", ".webm", ".avi", ".mkv"];
  return videoExts.includes(ext) ? "VIDEO" : "IMAGE";
}

export async function uploadFile(file: File): Promise<string> {
  // ── ADAPTAR PARA PRODUÇÃO: substitua este bloco ──────────────────────────
  await ensureDir();
  const filename = genFilename(file.name);
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(UPLOAD_DIR, filename), buffer);
  return `/uploads/${filename}`;
  // ─────────────────────────────────────────────────────────────────────────
}

export async function deleteFile(fileUrl: string): Promise<void> {
  if (!fileUrl.startsWith("/uploads/")) return;
  try {
    await unlink(path.join(UPLOAD_DIR, path.basename(fileUrl)));
  } catch {
    // Ignora se arquivo não existir
  }
}
