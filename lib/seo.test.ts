// The operator console is never indexed (the Krizaka family contract, scripts/check-seo-family.mjs).
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { auditRobots } from "../scripts/check-seo-family.mjs";
import robots from "../app/robots";

const read = (p: string) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");

describe("admin.orochia.com is not indexed", () => {
  it("robots.txt says Disallow: / for everyone", () => {
    expect(robots().rules).toEqual({ userAgent: "*", disallow: "/" });
    expect(auditRobots("User-Agent: *\nDisallow: /\n", { host: "https://admin.orochia.com", index: false, sitemap: false })).toEqual([]);
  });

  it("every response and every page says noindex", () => {
    expect(read("next.config.mjs")).toMatch(/X-Robots-Tag", value: "noindex, nofollow"/);
    expect(read("app/layout.tsx")).toMatch(/robots: \{ index: false, follow: false \}/);
  });

  it("the gates (IP list, sign-in) let a crawler read robots.txt", () => {
    expect(read("proxy.ts")).toMatch(/"\/robots\.txt"/);
  });
});
