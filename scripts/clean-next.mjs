import fs from "fs";
import path from "path";

const targets = [
  path.join(process.cwd(), ".next"),
  path.join(process.cwd(), "node_modules", ".cache", "next"),
];

for (const dir of targets) {
  try {
    fs.rmSync(dir, { recursive: true, force: true });
    console.log(`Removed: ${dir}`);
  } catch {
    // ignore missing paths
  }
}
