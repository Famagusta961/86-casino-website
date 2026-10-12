import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import { readFile, unlink } from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { PrismaClient } from "@prisma/client";
const base = process.env.TEST_BASE_URL || "http://localhost:3000";
if (
  !["localhost", "127.0.0.1"].includes(new URL(base).hostname) ||
  new URL(process.env.DATABASE_URL).hostname !== "127.0.0.1" ||
  new URL(process.env.DATABASE_URL).port !== "55486"
)
  throw Error(
    "Tests require the disposable local PostgreSQL instance on port 55486. Never run against production.",
  );
const prisma = new PrismaClient();
const cookie = (time = Date.now()) => {
  const value = `admin.${time}`;
  return `86_admin_session=${value}.${crypto.createHmac("sha256", process.env.SESSION_SECRET).update(value).digest("hex")}`;
};
const headers = () => ({
  "Content-Type": "application/json",
  cookie: cookie(),
});
const request = (url, method = "GET", data) =>
  fetch(base + url, {
    method,
    headers: headers(),
    ...(data ? { body: JSON.stringify(data) } : {}),
  });
const tag = `qa-${Date.now()}`;
test("public pages, metadata, health and admin protection", async () => {
  for (const url of [
    "/",
    "/casino",
    "/promotions",
    "/events",
    "/gallery",
    "/about",
    "/vip",
    "/visit",
    "/contact",
    "/faq",
    "/privacy",
    "/terms",
    "/responsible-gaming",
    "/api/health",
    "/sitemap.xml",
    "/robots.txt",
  ])
    assert.equal((await fetch(base + url)).status, 200, url);
  assert.equal((await fetch(base + "/not-a-page")).status, 404);
  assert.equal(
    (await fetch(base + "/admin/dashboard", { redirect: "manual" })).status,
    307,
  );
  for (const collection of [
    "games",
    "promotions",
    "events",
    "gallery",
    "pages",
  ])
    assert.equal((await fetch(base + "/api/admin/" + collection)).status, 401);
  assert.equal(
    (await fetch(base + "/api/admin/upload", { method: "POST" })).status,
    401,
  );
});
test("signed session expiry and malformed-cookie rejection", async () => {
  assert.equal((await request("/api/admin/games")).status, 200);
  for (const value of [
    cookie(Date.now() - 13 * 3600000),
    cookie(Date.now() + 60000),
    "86_admin_session=admin.1.é",
  ])
    assert.equal(
      (await fetch(base + "/api/admin/games", { headers: { cookie: value } }))
        .status,
      401,
    );
});
test("contact validates and persists messages", async () => {
  for (const data of [
    { name: " ", email: "x", message: " " },
    { name: "QA", email: "invalid", message: "Hello" },
  ])
    assert.equal((await request("/api/contact", "POST", data)).status, 400);
  const data = {
    name: tag,
    email: `${tag}@example.test`,
    message: "Disposable integration test",
  };
  assert.equal((await request("/api/contact", "POST", data)).status, 200);
  const saved = await prisma.contactMessage.findFirst({
    where: { email: data.email },
  });
  assert.ok(saved);
  assert.equal(saved.message, data.message);
  await prisma.contactMessage.delete({ where: { id: saved.id } });
});
test("all CMS collections support create, edit, list and delete", async () => {
  const common = {
    title: tag,
    subtitle: "QA",
    description: "QA",
    image: "/assets/casino/002.webp",
    active: false,
  };
  const records = {
    games: {
      name: tag,
      subtitle: "QA",
      description: "QA",
      image: common.image,
      active: false,
    },
    promotions: common,
    events: { ...common, dateTime: "2099-01-01T18:00:00Z" },
    gallery: {
      image: common.image,
      altText: tag,
      category: "qa",
      active: false,
    },
    pages: { slug: tag, title: tag, body: "QA", published: false },
  };
  for (const [resource, data] of Object.entries(records)) {
    const response = await request("/api/admin/" + resource, "POST", data);
    assert.equal(response.status, 200, resource);
    const saved = await response.json();
    try {
      assert.ok(
        (await (await request("/api/admin/" + resource)).json()).some(
          (x) => x.id === saved.id,
        ),
      );
      const changed = await request("/api/admin/" + resource, "PATCH", {
        id: saved.id,
        ...(resource === "gallery"
          ? { caption: "Edited" }
          : resource === "games"
            ? { name: tag + " edited" }
            : { title: tag + " edited" }),
      });
      assert.equal(changed.status, 200);
    } finally {
      assert.equal(
        (await request("/api/admin/" + resource, "DELETE", { id: saved.id }))
          .status,
        200,
      );
    }
  }
});
test("upload persists to volume, serves identical bytes and rejects invalid files", async () => {
  const bytes = await readFile("public/assets/casino/002.webp");
  const form = new FormData();
  form.append(
    "file",
    new File([bytes], "../../original.webp", { type: "image/webp" }),
  );
  const response = await fetch(base + "/api/admin/upload", {
    method: "POST",
    headers: { cookie: cookie() },
    body: form,
  });
  assert.equal(response.status, 200);
  const result = await response.json();
  try {
    assert.match(result.filename, /^[a-f0-9-]+\.webp$/);
    assert.deepEqual(
      await readFile(path.join(process.env.UPLOAD_DIR, result.filename)),
      bytes,
    );
    const served = await fetch(base + result.path);
    assert.equal(served.headers.get("content-type"), "image/webp");
    assert.deepEqual(Buffer.from(await served.arrayBuffer()), bytes);
  } finally {
    await unlink(path.join(process.env.UPLOAD_DIR, result.filename));
  }
  for (const file of [
    new File(["bad"], "fake.png", { type: "image/png" }),
    new File([Buffer.alloc(8 * 1024 * 1024 + 1)], "big.png", {
      type: "image/png",
    }),
  ]) {
    const data = new FormData();
    data.append("file", file);
    const r = await fetch(base + "/api/admin/upload", {
      method: "POST",
      headers: { cookie: cookie() },
      body: data,
    });
    assert.ok([400, 413].includes(r.status));
  }
  assert.equal((await fetch(base + "/media/%2e%2e%5c.env")).status, 404);
});
test("unpublishing known pages does not resurrect fallback content", async () => {
  const page = await prisma.page.findUnique({ where: { slug: "about" } });
  assert.ok(page);
  try {
    await prisma.page.update({
      where: { id: page.id },
      data: { published: false },
    });
    assert.equal((await fetch(base + "/about")).status, 404);
  } finally {
    await prisma.page.update({
      where: { id: page.id },
      data: { published: page.published },
    });
  }
});
test("CMS edits render publicly and empty games do not resurrect fallback records", async () => {
  const active = await prisma.game.findMany({ where: { active: true } });
  assert.ok(active.length);
  try {
    await prisma.game.update({
      where: { id: active[0].id },
      data: { subtitle: tag },
    });
    assert.ok((await (await fetch(base + "/casino")).text()).includes(tag));
    assert.ok((await (await fetch(base + "/")).text()).includes(tag));
    await prisma.game.updateMany({
      where: { active: true },
      data: { active: false },
    });
    const page = await fetch(base + "/");
    assert.equal(page.status, 200);
    assert.ok(
      (await page.text()).includes(
        "Contact our team for the latest gaming information.",
      ),
    );
    assert.ok(
      !(await (await fetch(base + "/casino")).text()).includes(
        "fallback-roulette",
      ),
    );
  } finally {
    for (const game of active)
      await prisma.game.update({
        where: { id: game.id },
        data: { active: true, subtitle: game.subtitle },
      });
  }
});
test("expired promotions and events are not advertised", async () => {
  const promo = await prisma.promotion.create({
    data: {
      title: tag,
      subtitle: "QA",
      description: "QA",
      image: "/assets/casino/001.webp",
      active: true,
      endDate: new Date("2000-01-01"),
    },
  });
  const event = await prisma.event.create({
    data: {
      title: tag,
      subtitle: "QA",
      description: "QA",
      image: "/assets/casino/001.webp",
      active: true,
      dateTime: new Date("2000-01-01"),
    },
  });
  try {
    assert.ok(
      !(await (await fetch(base + "/promotions")).text()).includes(tag),
    );
    assert.ok(!(await (await fetch(base + "/events")).text()).includes(tag));
  } finally {
    await prisma.promotion.delete({ where: { id: promo.id } });
    await prisma.event.delete({ where: { id: event.id } });
  }
});
test("startup seed preserves CMS images and settings", async () => {
  const game = await prisma.game.findUnique({ where: { id: "seed-game-0" } });
  const settings = await prisma.siteSetting.findUnique({
    where: { id: "site" },
  });
  assert.ok(game && settings);
  try {
    await prisma.game.update({
      where: { id: game.id },
      data: { image: "/assets/casino/014.webp" },
    });
    await prisma.siteSetting.update({
      where: { id: "site" },
      data: { title: tag },
    });
    const result = spawnSync(
      process.execPath,
      ["node_modules/tsx/dist/cli.mjs", "prisma/seed.ts"],
      { env: process.env, encoding: "utf8" },
    );
    assert.equal(result.status, 0);
    assert.equal(
      (await prisma.game.findUnique({ where: { id: game.id } })).image,
      "/assets/casino/014.webp",
    );
    assert.equal(
      (await prisma.siteSetting.findUnique({ where: { id: "site" } })).title,
      tag,
    );
  } finally {
    await prisma.game.update({
      where: { id: game.id },
      data: { image: game.image },
    });
    await prisma.siteSetting.update({
      where: { id: "site" },
      data: { title: settings.title },
    });
  }
});
test.after(async () => {
  await prisma.$disconnect();
});
