// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

import pkg from "./package.json";

import "./app/lib/env";

// Vercel exposes the deployed commit as VERCEL_GIT_COMMIT_SHA at build time.
// Locally it is undefined, so we fall back to "dev".
// eslint-disable-next-line node/no-process-env
const gitSha = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "dev";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      // Exposed to the client. Read anywhere via useRuntimeConfig().public.
      appVersion: pkg.version,
      gitSha,
    },
  },
  app: {
    head: {
      link: [
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
        { rel: "alternate icon", type: "image/x-icon", href: "/favicon.ico" },
      ],
    },
  },
  modules: [
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/icon",
    "@pinia/nuxt",
    "@vueuse/nuxt",
  ],
  css: ["~/assets/css/main.css"],
  fonts: {
    families: [
      { name: "Inter", provider: "google", weights: [400, 500, 600, 700] },
      { name: "JetBrains Mono", provider: "google", weights: [400, 500] },
    ],
  },
  eslint: {
    config: {
      standalone: false,
    },
  },
  vite: {
    plugins: [
      tailwindcss() as any,
    ],
    optimizeDeps: {
      include: [
        "@codemirror/commands",
        "@codemirror/lang-markdown",
        "@codemirror/language",
        "@codemirror/state",
        "@codemirror/view",
        "@lezer/highlight",
        "@shikijs/markdown-it",
        "@slidev/parser",
        "markdown-it",
      ],
    },
  },
});
