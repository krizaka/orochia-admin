import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

/**
 * The build badge in the header (components/BuildBadge.tsx): package.json version, short commit — `APP_COMMIT_SHA` when
 * the builder gives it (App Platform: `${_self.COMMIT_HASH}`; its Docker build has no .git), else `git rev-parse` —
 * and NEXT_PUBLIC_APP_ENV (local · dev · staging · production; hidden in production).
 */
function commitSha() {
  const given = process.env.APP_COMMIT_SHA?.trim();
  if (given) return given.slice(0, 7);
  try {
    return execFileSync("git", ["rev-parse", "--short=7", "HEAD"], { stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
  } catch {
    return "";
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  env: {
    NEXT_PUBLIC_APP_VERSION: JSON.parse(readFileSync(new URL("./package.json", import.meta.url), "utf8")).version,
    NEXT_PUBLIC_APP_COMMIT_SHA: commitSha(),
    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV?.trim() || "local",
  },
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "no-referrer" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
    ];
  },
};

export default nextConfig;
