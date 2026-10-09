import { krizakaUi } from "@krizaka/config/eslint/krizaka-ui";
import { krizakaNext } from "@krizaka/config/eslint/next";

// The shared Next.js config, and the four UI rules as errors: the console is at zero (lint-ratchet.json), it stays there.
const config = [
  ...krizakaNext,
  ...krizakaUi({ severity: "error" }),
  {
    // A `_`-prefixed argument is intentionally ignored (a server action's previous state).
    rules: { "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }] },
  },
  { ignores: [".next/**", "next-env.d.ts"] },
];

export default config;
