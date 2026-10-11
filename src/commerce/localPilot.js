import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";

// One operator-reviewed pilot, development only. Never part of static exports.
export function readLocalPilotRegistry(env = {}, mode = "production") {
  if (mode !== "development" || env.AFFILIATE_LOCAL_PILOT !== "true" || !env.AFFILIATE_PILOT_SAKE_ID ||
      !/^[a-f0-9]{64}$/.test(env.AFFILIATE_PILOT_REGISTRY_SHA256 || "")) return null;
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), ".cache/affiliate/pilot-registry.json"));
    if (createHash("sha256").update(raw).digest("hex") !== env.AFFILIATE_PILOT_REGISTRY_SHA256) return null;
    const registry = JSON.parse(raw);
    if (registry.schemaVersion !== 1 || registry.offers?.length !== 0 || (registry.searchOffers || []).length ||
        registry.images?.length !== 1 || registry.images[0].entityId !== env.AFFILIATE_PILOT_SAKE_ID ||
        registry.images[0].standaloneCreative !== true) return null;
    return registry;
  } catch { return null; }
}
