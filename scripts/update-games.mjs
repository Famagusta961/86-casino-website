// One-off CMS update; never run during application startup or deployment.
// CMS_BASE_URL, ADMIN_EMAIL and ADMIN_PASSWORD are required. Dry-run by default.
// Supply --apply to save. Existing descriptions, photographs and IDs are retained.
const names = [
  "Three Card Poker",
  "Baccarat",
  "European Roulette",
  "Niu Niu",
  "Seven Card Poker",
  "Blackjack",
  "Caribbean Poker",
  "Mini Baccarat",
  "Quad Crush Poker",
  "Ultimate Poker",
];
const base = process.env.CMS_BASE_URL;
if (!base || !process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD)
  throw Error(
    "Set CMS_BASE_URL, ADMIN_EMAIL and ADMIN_PASSWORD securely in the environment.",
  );
const url = new URL(base);
if (
  url.protocol !== "https:" &&
  !["localhost", "127.0.0.1"].includes(url.hostname)
)
  throw Error("Remote CMS connections require HTTPS.");
const html = await (await fetch(base + "/admin")).text();
const form = [...html.matchAll(/<form\b[^>]*>([\s\S]*?)<\/form>/g)].find(
  (match) => match[1].includes('name="email"'),
)?.[1];
const action = form?.match(/name="(\$ACTION_ID_[^"]+)"/)?.[1];
if (!action) throw Error("Admin login form unavailable.");
const body = new FormData();
body.set(action, "");
body.set("email", process.env.ADMIN_EMAIL);
body.set("password", process.env.ADMIN_PASSWORD);
const login = await fetch(base + "/admin", {
  method: "POST",
  body,
  redirect: "manual",
});
const cookie = login.headers
  .getSetCookie()
  .map((value) => value.split(";")[0])
  .join("; ");
if (!cookie || !login.headers.get("location")?.includes("/admin/dashboard"))
  throw Error("Admin login failed.");
async function request(method = "GET", data) {
  const response = await fetch(base + "/api/admin/games", {
    method,
    headers: { cookie, "Content-Type": "application/json" },
    ...(data ? { body: JSON.stringify(data) } : {}),
  });
  if (!response.ok) throw Error(`CMS ${method} failed (${response.status}).`);
  return response.json();
}
const existing = await request();
const normalized = (name) => name.trim().toLowerCase();
const changes = [];
const selected = new Set();
for (const [sortOrder, name] of names.entries()) {
  const aliases = [name];
  if (name === "European Roulette") aliases.push("Roulette");
  if (name === "Caribbean Poker") aliases.push("Carribean Poker");
  const matches = existing.filter((game) =>
    aliases.map(normalized).includes(normalized(game.name)),
  );
  if (matches.length > 1)
    throw Error(`Duplicate records for ${name}; resolve in the CMS first.`);
  const record = matches[0];
  if (record) {
    selected.add(record.id);
    const patch = { id: record.id };
    for (const [key, value] of Object.entries({
      name,
      sortOrder,
      active: true,
    }))
      if (record[key] !== value) patch[key] = value;
    if (Object.keys(patch).length > 1)
      changes.push({ method: "PATCH", data: patch });
  } else {
    changes.push({
      method: "POST",
      data: {
        name,
        subtitle: "At 86 Casino",
        description: `For information about ${name} at 86 Casino, contact our team.`,
        image:
          sortOrder % 2 ? "/assets/casino/007.webp" : "/assets/casino/001.webp",
        sortOrder,
        active: true,
      },
    });
  }
}
const others = existing
  .filter((record) => !selected.has(record.id))
  .sort((a, b) => a.sortOrder - b.sortOrder || a.id.localeCompare(b.id));
for (const [index, record] of others.entries()) {
  const sortOrder = names.length + index;
  if (record.sortOrder !== sortOrder)
    changes.push({ method: "PATCH", data: { id: record.id, sortOrder } });
}
console.log(
  JSON.stringify(
    { mode: process.argv.includes("--apply") ? "apply" : "dry-run", changes },
    null,
    2,
  ),
);
if (process.argv.includes("--apply")) {
  for (const change of changes) await request(change.method, change.data);
  const saved = await request();
  for (const [sortOrder, name] of names.entries()) {
    const matches = saved.filter((record) => record.name === name);
    if (
      matches.length !== 1 ||
      !matches[0].active ||
      matches[0].sortOrder !== sortOrder
    )
      throw Error(`Verification failed for ${name}.`);
  }
  for (const original of existing) {
    const record = saved.find((item) => item.id === original.id);
    if (
      !record ||
      ["description", "subtitle", "image"].some(
        (key) => record[key] !== original[key],
      )
    )
      throw Error("Existing content preservation verification failed.");
  }
  console.log(
    `Verified ten published games; ${saved.length} total records, existing content retained.`,
  );
}
