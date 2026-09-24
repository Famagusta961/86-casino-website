import { mkdir, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";

const allowed: Record<string, string> = { "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp", "image/gif": ".gif" };
const maxBytes = 8 * 1024 * 1024;

export async function POST(request: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File) || !allowed[file.type]) return NextResponse.json({ error: "A JPG, PNG, WEBP or GIF image is required" }, { status: 400 });
  if (file.size > maxBytes) return NextResponse.json({ error: "Images must be 8MB or smaller" }, { status: 413 });
  const directory = process.env.UPLOAD_DIR || path.join(process.cwd(), "public/uploads");
  await mkdir(directory, { recursive: true });
  const filename = `${crypto.randomUUID()}${allowed[file.type]}`;
  await writeFile(path.join(directory, filename), Buffer.from(await file.arrayBuffer()), { flag: "wx" });
  return NextResponse.json({ path: `/media/${filename}`, filename });
}