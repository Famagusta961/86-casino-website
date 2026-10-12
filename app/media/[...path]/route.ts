import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
const types: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await params;
  if (
    segments.length !== 1 ||
    !/^[a-zA-Z0-9_-]+\.(jpe?g|png|webp|gif)$/i.test(segments[0])
  )
    return new NextResponse("Not found", { status: 404 });
  const file = path.join(
    process.env.UPLOAD_DIR || path.join(process.cwd(), "public/uploads"),
    segments[0],
  );
  try {
    const data = await fs.readFile(file);
    return new NextResponse(data, {
      headers: {
        "Content-Type": types[path.extname(file).toLowerCase()],
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
