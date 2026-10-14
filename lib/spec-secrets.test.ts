import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("App Platform spec", () => {
  it("declares every password, token and secret as type SECRET", () => {
    const spec = fs.readFileSync(path.join(__dirname, "..", "deploy/app-spec.dev.yaml"), "utf8");
    const blocks = spec.split(/\n\s*- key: /).slice(1);
    const sensitive = blocks.filter((b) => /^[A-Z0-9_]*(PASSWORD|TOKEN|SECRET|API_KEY)\b/.test(b));
    expect(sensitive.length).toBeGreaterThan(0);
    for (const b of sensitive) expect(b, b.split("\n")[0]).toMatch(/type: SECRET/);
  });
});
