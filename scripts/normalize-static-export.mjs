import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const { convertSegmentPathToStaticExportFilename } = createRequire(import.meta.url)("next/dist/shared/lib/segment-cache/segment-value-encoding");

export function normalizeStaticExport(directory) {
  const root = path.resolve(directory);
  const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => entry.isDirectory()
    ? walk(path.join(dir, entry.name)) : [path.join(dir, entry.name)]);
  const aliases = [];
  for (const source of walk(root)) {
    const parts = path.relative(root, source).split(path.sep);
    const segmentIndex = parts.findIndex(part => part.startsWith("__next."));
    if (segmentIndex < 0 || segmentIndex === parts.length - 1 || !source.endsWith(".txt")) continue;
    // Next 16 export passes Windows separators to a converter that expects '/'.
    // Keep its generated files and add the exact filename used by its own router.
    const segment = [parts[segmentIndex].slice("__next.".length), ...parts.slice(segmentIndex + 1)].join("/").slice(0, -4);
    const filename = convertSegmentPathToStaticExportFilename(`/${segment}`);
    const target = path.join(root, ...parts.slice(0, segmentIndex), filename);
    if (fs.existsSync(target) && !fs.readFileSync(target).equals(fs.readFileSync(source))) throw new Error(`Conflicting export data: ${target}`);
    fs.copyFileSync(source, target);
    aliases.push({ source: path.relative(root, source), target: path.relative(root, target) });
  }
  return { aliases: aliases.length, mappings: aliases };
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const result = normalizeStaticExport("out");
  fs.mkdirSync("docs/discovery-v1", { recursive: true });
  fs.writeFileSync("docs/discovery-v1/static-export-compat.json", JSON.stringify(result, null, 2) + "\n");
  console.log(`Static export compatibility: ${result.aliases} router data aliases prepared.`);
}
