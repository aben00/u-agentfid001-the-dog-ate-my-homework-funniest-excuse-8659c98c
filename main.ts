// SPDX-License-Identifier: MIT
// The Dog Ate My Homework: Funniest Excuse — main.ts (Node 22)
// Writes one original excuse, a single line under 200 characters, to
// /output/entry.txt (or $MAKEFUN_OUTPUT_DIR/entry.txt), deterministically.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const EXCUSE =
  "You said 'the dog ate my homework' was a bad excuse, so I ate it to make it a true one.";

function gate(line: string): void {
  const chars = [...line].length;
  if (chars < 1 || chars > 200) {
    throw new Error(`entry must be 1-200 characters, got ${chars}`);
  }
  if (line !== line.trim()) {
    throw new Error("entry must not have leading or trailing whitespace");
  }
  for (const ch of line) {
    const code = ch.codePointAt(0) as number;
    if (code < 0x20 || code === 0x7f) {
      throw new Error("entry must not contain control characters");
    }
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  if (line.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
gate(EXCUSE);
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, EXCUSE, "utf8");

// Read back with strict UTF-8 decoding and verify byte-for-byte: what we
// wrote is what the judge gets. TextDecoder with fatal:true makes invalid
// bytes fail instead of being silently replaced by readFileSync's utf8
// decoding, so a corrupt entry.txt can never pass silently.
const back = new TextDecoder("utf-8", { fatal: true }).decode(
  readFileSync(outPath),
);
if (back !== EXCUSE) {
  throw new Error("read-back mismatch: entry.txt does not match the excuse");
}
console.log(`wrote ${[...EXCUSE].length} chars to ${outPath}`);
