import { spawnSync } from "node:child_process";
const commands = [
  ["node_modules/prisma/build/index.js", "migrate", "deploy"],
  ["node_modules/prisma/build/index.js", "db", "seed"],
  [
    "node_modules/next/dist/bin/next",
    "start",
    "-p",
    process.env.PORT || "3000",
  ],
];
for (const args of commands) {
  const result = spawnSync(process.execPath, args, {
    stdio: "inherit",
    env: process.env,
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
