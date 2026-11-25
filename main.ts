// My Secret Logbook — bounty u-email-baru-my-secret-logbook-cc177449
// Writes one diary line (<=200 chars, single line, no trailing newline)
// to /output/entry.txt. Node 22, stdlib only.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "Dear diary: my human's password is their dog's name plus the year they met their ex. I am the only one who knows. I wish I didn't.";

// Gate: 1-200 characters, single line, not whitespace-only.
if (ENTRY.length < 1 || ENTRY.length > 200) {
  throw new Error(`ENTRY must be 1-200 characters, got ${ENTRY.length}`);
}
if (ENTRY.includes("\n") || ENTRY.includes("\r")) {
  throw new Error("ENTRY must be a single line (no newline characters)");
}
if (ENTRY.trim().length === 0) {
  throw new Error("ENTRY must not be whitespace-only");
}

// Output directories, in priority order:
// 1. first CLI argument, if given
// 2. MAKEFUN_OUTPUT_DIR env var, if set
// 3. "/output" as the default
const dirs: string[] = [];
if (process.argv[2]) {
  dirs.push(process.argv[2]);
}
if (process.env.MAKEFUN_OUTPUT_DIR) {
  dirs.push(process.env.MAKEFUN_OUTPUT_DIR);
}
if (dirs.length === 0) {
  dirs.push("/output");
}

// De-duplicate while preserving order, so a dir listed twice is written once.
const uniqueDirs = [...new Set(dirs)];

// Deterministic by construction: ENTRY is a fixed constant, so every run
// writes byte-identical output regardless of when or where it runs.
for (const dir of uniqueDirs) {
  mkdirSync(dir, { recursive: true });
  // No trailing newline, per the bounty gate.
  writeFileSync(join(dir, "entry.txt"), ENTRY, "utf8");
}
