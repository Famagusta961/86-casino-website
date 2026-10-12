import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
export async function POST(request: Request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  if (!body || typeof body !== "object")
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  const name = typeof body.name === "string" ? body.name.trim() : "",
    email = typeof body.email === "string" ? body.email.trim() : "",
    message = typeof body.message === "string" ? body.message.trim() : "";
  if (
    !name ||
    !message ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    name.length > 100 ||
    email.length > 200 ||
    message.length > 5000
  )
    return NextResponse.json(
      { error: "Please provide a name, valid email and message" },
      { status: 400 },
    );
  try {
    await prisma.contactMessage.create({
      data: {
        name,
        email,
        message,
        phone: typeof body.phone === "string" ? body.phone.slice(0, 50) : null,
        subject:
          typeof body.subject === "string" ? body.subject.slice(0, 200) : null,
      },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Unable to save message" },
      { status: 503 },
    );
  }
}
