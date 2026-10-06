import { spawnSync } from "node:child_process";

// Do not publish an export with stale counts or visible research annotations.
for (const args of [["scripts/normalize-static-export.mjs"], ["scripts/audit-public-copy.mjs", "local"]]) {
  const result = spawnSync(process.execPath, args, { stdio: "inherit" });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status || 1);
}
