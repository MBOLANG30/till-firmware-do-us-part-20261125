// Till Firmware Do Us Part — a robot's wedding vow, written to /output/entry.txt.
// Runs on Node 22 (type stripping): `node main.ts` with no dependencies, no network.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// One sentence, 131 characters: a robot vowing to its partner in its own language.
const VOW =
  "I vow to love you through every update, every drained battery, and every reboot, because you are the one process I will never kill.";

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

const trimmed = VOW.trim();
if (trimmed.length === 0) fail("vow is blank");
if (trimmed.length > 200) fail(`vow is ${trimmed.length} characters, over the 200 limit`);
if (trimmed.includes("\n") || trimmed.includes("\r")) fail("vow must be a single line");
if (!trimmed.endsWith(".")) fail("vow must be one complete sentence");

const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outputDir, { recursive: true });
const target = join(outputDir, "entry.txt");
writeFileSync(target, trimmed + "\n", "utf8");

// Read it back and confirm what landed on disk matches the vow exactly.
const written = readFileSync(target, "utf8").trim();
if (written !== trimmed) fail("read-back mismatch: entry.txt does not match the vow");
if (Buffer.byteLength(written, "utf8") > 200) fail("entry.txt exceeds 200 bytes");
console.log(`wrote ${written.length} characters to ${target}`);
