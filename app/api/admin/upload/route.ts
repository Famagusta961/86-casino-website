import { mkdir, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";

const allowed: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};
const maxBytes = 8 * 1024 * 1024;

export async function POST(request: Request) {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File) || !allowed[file.type])
    return NextResponse.json(
      { error: "A JPG, PNG, WEBP or GIF image is required" },
      { status: 400 },
    );
  if (file.size > maxBytes)
    return NextResponse.json(
      { error: "Images must be 8MB or smaller" },
      { status: 413 },
    );
  const bytes = Buffer.from(await file.arrayBuffer());
  const valid =
    file.type === "image/png"
      ? bytes
          .subarray(0, 8)
          .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
      : file.type === "image/jpeg"
        ? bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255
        : file.type === "image/webp"
          ? bytes.toString("ascii", 0, 4) === "RIFF" &&
            bytes.toString("ascii", 8, 12) === "WEBP"
          : ["GIF87a", "GIF89a"].includes(bytes.toString("ascii", 0, 6));
  if (!valid)
    return NextResponse.json(
      { error: "The image contents do not match its file type" },
      { status: 400 },
    );
  const directory =
    process.env.UPLOAD_DIR || path.join(process.cwd(), "public/uploads");
  await mkdir(directory, { recursive: true });
  const filename = `${crypto.randomUUID()}${allowed[file.type]}`;
  await writeFile(path.join(directory, filename), bytes, { flag: "wx" });
  return NextResponse.json({ path: `/media/${filename}`, filename });
}
