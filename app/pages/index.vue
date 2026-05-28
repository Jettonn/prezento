<script setup lang="ts">
import { APP_NAME } from "~/lib/constants";

const authStore = useAuthStore();

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Templates", href: "#templates" },
];

const heroSlides = [
  { number: 1, title: "Hero", active: true },
  { number: 2, title: "Problem" },
  { number: 3, title: "Solution" },
  { number: 4, title: "Features" },
  { number: 5, title: "Product" },
  { number: 6, title: "Market" },
  { number: 7, title: "Roadmap" },
  { number: 8, title: "Team" },
  { number: 9, title: "Closing" },
];

const heroIcons = [
  { icon: "i-lucide-zap", label: "Fast writing" },
  { icon: "i-lucide-eye", label: "Live preview" },
  { icon: "i-lucide-keyboard", label: "Keyboard-first" },
  { icon: "i-lucide-cloud", label: "Auto-save" },
];

const trustedBy = [
  { icon: "i-simple-icons-linear", label: "Linear" },
  { icon: "i-simple-icons-vercel", label: "Vercel" },
  { icon: "i-simple-icons-notion", label: "Notion" },
  { icon: "i-simple-icons-framer", label: "Framer" },
  { icon: "i-simple-icons-github", label: "GitHub" },
  { icon: "i-simple-icons-dropbox", label: "Dropbox" },
];

const features = [
  {
    icon: "i-lucide-pencil",
    title: "Markdown First",
    body: "Write your slides in clean Markdown. Focus on content, not formatting.",
    variant: "code" as const,
  },
  {
    icon: "i-lucide-square-plus",
    title: "New Slide in One Click",
    body: "Add beautiful, pre-built layouts instantly. Like PowerPoint, but faster.",
    variant: "layouts" as const,
  },
  {
    icon: "i-lucide-eye",
    title: "Live Preview",
    body: "See your presentation update in real time as you write.",
    variant: "preview" as const,
  },
  {
    icon: "i-lucide-keyboard",
    title: "Keyboard First",
    body: "Designed for speed. Use shortcuts, commands and snippets.",
    variant: "keys" as const,
  },
  {
    icon: "i-lucide-code-2",
    title: "Code & Syntax Highlighting",
    body: "Beautiful code blocks with syntax highlighting.",
    variant: "syntax" as const,
  },
  {
    icon: "i-lucide-cloud",
    title: "Auto Save & Export",
    body: "Auto save your work and export to PDF, PPTX or share online.",
    variant: "export" as const,
  },
];

const templates = [
  {
    label: "Startup Pitch",
    title: "Building the next generation product",
    style: "dark-gradient",
  },
  {
    label: "Product Update",
    title: "Product Update May 2024",
    style: "light",
  },
  {
    label: "Developer Talk",
    title: "Building fast with modern tooling",
    style: "dark",
  },
  {
    label: "Company Deck",
    title: "Our mission is to empower creators",
    style: "violet-gradient",
  },
];

const ctaHref = computed(() => (authStore.user ? "/app" : "/sign-in"));
const ctaLabel = computed(() => (authStore.user ? "Open app" : "Get Started Free"));
</script>

<template>
  <div class="min-h-dvh bg-background text-text antialiased">
    <!-- Nav -->
    <header class="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
      <div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <NuxtLink to="/" class="flex items-center gap-2">
          <span class="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
            <Icon name="i-lucide-asterisk" size="18" />
          </span>
          <span class="text-[15px] font-semibold tracking-tight">{{ APP_NAME }}</span>
        </NuxtLink>

        <nav class="hidden items-center gap-8 text-[14px] text-text-secondary md:flex">
          <a
            v-for="link in navLinks"
            :key="link.label"
            :href="link.href"
            class="transition hover:text-text"
          >
            {{ link.label }}
          </a>
        </nav>

        <div class="flex items-center gap-4">
          <template v-if="authStore.user">
            <NuxtLink
              to="/app"
              class="flex items-center gap-2 rounded-input border border-border bg-surface py-1 pr-4 pl-1 text-[13px] font-medium text-text shadow-soft transition hover:bg-background"
            >
              <UserAvatar
                :image="authStore.user.image"
                :name="authStore.user.name"
                :size="26"
              />
              Open app
            </NuxtLink>
          </template>
          <template v-else>
            <NuxtLink
              to="/sign-in"
              class="hidden text-[14px] text-text-secondary transition hover:text-text sm:block"
            >
              Log in
            </NuxtLink>
            <NuxtLink
              to="/sign-in"
              class="rounded-input bg-primary px-4 py-2 text-[13px] font-medium text-white shadow-soft transition hover:bg-primary-hover"
            >
              Get Started Free
            </NuxtLink>
          </template>
        </div>
      </div>
    </header>

    <!-- Hero -->
    <section class="relative overflow-hidden">
      <div class="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[640px] bg-gradient-to-b from-primary/[0.06] to-transparent" />

      <div class="mx-auto grid max-w-6xl gap-12 px-6 pt-16 pb-20 lg:grid-cols-[minmax(0,440px)_1fr] lg:gap-16 lg:pt-24">
        <!-- Hero copy -->
        <div class="flex max-w-xl flex-col">
          <span class="inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[12px] font-medium text-primary">
            Markdown-first presentation app
          </span>

          <h1 class="mt-6 text-[56px] leading-[1.02] font-semibold tracking-tight lg:text-[64px]">
            Write slides.
            <br>
            <span class="text-primary">Not</span> slide decks.
          </h1>

          <p class="mt-6 max-w-md text-[16px] leading-relaxed text-text-secondary">
            {{ APP_NAME }} lets you create beautiful presentations using Markdown, with instant live preview.
          </p>

          <div class="mt-8 flex flex-wrap items-center gap-3">
            <NuxtLink
              :to="ctaHref"
              class="inline-flex items-center gap-2 rounded-input bg-primary px-5 py-3 text-[14px] font-medium text-white shadow-soft transition hover:bg-primary-hover"
            >
              {{ ctaLabel }}
            </NuxtLink>
            <a
              href="#templates"
              class="inline-flex items-center gap-2 rounded-input border border-border bg-surface px-5 py-3 text-[14px] font-medium text-text transition hover:bg-background"
            >
              View Templates
            </a>
          </div>

          <ul class="mt-12 grid grid-cols-4 gap-4 max-w-md">
            <li
              v-for="item in heroIcons"
              :key="item.label"
              class="flex flex-col items-start gap-2"
            >
              <span class="flex h-9 w-9 items-center justify-center rounded-input text-text-secondary">
                <Icon :name="item.icon" size="18" />
              </span>
              <span class="text-[12px] leading-tight text-text-secondary">{{ item.label }}</span>
            </li>
          </ul>
        </div>

        <!-- Hero mockup -->
        <div class="relative">
          <div class="overflow-hidden rounded-card border border-border bg-surface shadow-soft ring-1 ring-black/[0.02]">
            <!-- Mock top bar -->
            <div class="flex h-11 items-center gap-3 border-b border-border bg-surface px-4">
              <div class="flex items-center gap-1.5">
                <Icon
                  name="i-lucide-asterisk"
                  class="text-primary"
                  size="16"
                />
                <span class="text-[13px] font-semibold tracking-tight">{{ APP_NAME }}</span>
              </div>
              <span class="text-[13px] text-text-secondary">Product Launch Deck</span>
              <span class="ml-2 flex items-center gap-1.5 text-[12px] text-text-secondary">
                <Icon name="i-lucide-cloud-check" size="12" />
                Saved just now
              </span>
              <div class="ml-auto flex items-center gap-1">
                <span class="flex h-6 w-6 items-center justify-center rounded text-text-secondary">
                  <Icon name="i-lucide-monitor" size="13" />
                </span>
                <span class="flex h-6 w-6 items-center justify-center rounded text-text-secondary">
                  <Icon name="i-lucide-tablet" size="13" />
                </span>
                <span class="flex h-6 w-6 items-center justify-center rounded text-text-secondary">
                  <Icon name="i-lucide-smartphone" size="13" />
                </span>
                <span class="ml-2 text-[12px] text-text-secondary">100%</span>
                <span class="ml-1 flex h-6 w-6 items-center justify-center rounded text-text-secondary">
                  <Icon name="i-lucide-maximize" size="13" />
                </span>
              </div>
            </div>

            <!-- 3-column body -->
            <div class="grid h-[460px] grid-cols-[140px_minmax(0,1fr)_minmax(0,1.1fr)]">
              <!-- Sidebar -->
              <aside class="flex flex-col border-r border-border bg-background/40 p-2">
                <button class="mb-2 flex items-center justify-center gap-1 rounded-input bg-primary px-2 py-1.5 text-[11px] font-medium text-white">
                  <Icon name="i-lucide-plus" size="12" />
                  New Slide
                </button>
                <ul class="flex flex-col gap-0.5 overflow-hidden">
                  <li
                    v-for="s in heroSlides"
                    :key="s.number"
                    class="flex items-center gap-2 rounded-input px-2 py-1.5 text-[11px]"
                    :class="s.active ? 'bg-primary/10 text-primary' : 'text-text-secondary'"
                  >
                    <span class="font-mono w-3 text-right">{{ s.number }}</span>
                    <span class="truncate">{{ s.title }}</span>
                    <span
                      v-if="s.active"
                      class="ml-auto h-1.5 w-1.5 rounded-full bg-primary"
                    />
                  </li>
                </ul>

                <!-- User avatar bottom of sidebar -->
                <div class="mt-auto flex items-center gap-2 rounded-input p-1.5">
                  <span class="flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-[10px] font-semibold text-primary">
                    AC
                  </span>
                  <div class="min-w-0">
                    <div class="truncate text-[10px] font-medium text-text">
                      Alex Chen
                    </div>
                    <div class="truncate text-[9px] text-text-secondary">
                      alex@example.com
                    </div>
                  </div>
                </div>
              </aside>

              <!-- Editor -->
              <section class="flex flex-col border-r border-border bg-surface">
                <div class="flex items-center gap-1.5 border-b border-border px-3 py-2">
                  <span class="flex items-center gap-1.5 rounded-input bg-background px-2 py-0.5 text-[11px] font-medium">
                    presentation.md
                    <span class="h-1 w-1 rounded-full bg-primary" />
                  </span>
                  <Icon
                    name="i-lucide-plus"
                    class="text-text-secondary"
                    size="12"
                  />
                </div>
                <div class="flex min-h-0 flex-1 overflow-hidden font-mono text-[11px] leading-[1.6]">
                  <div class="flex flex-col py-2 pr-1 pl-2 text-right text-text-secondary/40 tabular-nums">
                    <span v-for="n in 20" :key="n">{{ n }}</span>
                  </div>
                  <div class="flex-1 py-2 pr-3">
                    <div class="text-text-secondary">
                      ---
                    </div>
                    <div class="text-text-secondary">
                      layout: hero
                    </div>
                    <div class="text-text-secondary">
                      background: gradient
                    </div>
                    <div class="text-text-secondary">
                      ---
                    </div>
                    <div>&nbsp;</div>
                    <div class="text-primary">
                      # Building the future
                    </div>
                    <div>with modern tools</div>
                    <div>&nbsp;</div>
                    <div class="text-text-secondary">
                      &gt; The best way to predict the future
                    </div>
                    <div class="text-text-secondary">
                      &nbsp;&nbsp;is to build it.
                    </div>
                    <div>&nbsp;</div>
                    <div class="text-text-secondary">
                      ---
                    </div>
                    <div>&nbsp;</div>
                    <div class="text-primary">
                      ## The problem
                    </div>
                    <div>&nbsp;</div>
                    <div>Legacy tools are slow, complex</div>
                    <div>and hard to scale.</div>
                    <div>&nbsp;</div>
                    <div class="text-text-secondary">
                      - Too many moving parts
                    </div>
                    <div class="text-text-secondary">
                      - Steep learning curve
                    </div>
                  </div>
                </div>
                <div class="flex items-center justify-between border-t border-border px-3 py-1.5 text-[10px] text-text-secondary">
                  <span class="font-mono">Ln 1, Col 1 · Markdown · 612 words</span>
                </div>
              </section>

              <!-- Preview -->
              <section class="flex flex-col bg-background/30">
                <div class="flex min-h-0 flex-1 flex-col p-4">
                  <article class="relative flex w-full flex-1 flex-col overflow-hidden rounded-input border border-border bg-surface shadow-soft">
                    <div class="flex items-start justify-between px-4 pt-3 text-[9px] text-text-secondary">
                      <span>{{ APP_NAME }}</span>
                    </div>
                    <div class="flex flex-1 flex-col items-center justify-center px-5 text-center">
                      <h3 class="text-[18px] leading-tight font-semibold tracking-tight">
                        Building the future
                      </h3>
                      <h3 class="text-[18px] leading-tight font-semibold tracking-tight">
                        with <span class="text-primary">modern tools</span>
                      </h3>
                      <p class="mt-2 text-[9px] text-text-secondary">
                        The best way to predict the future is to build it.
                      </p>
                    </div>
                    <div class="relative h-4">
                      <div class="absolute right-1/2 -bottom-2 h-10 w-32 translate-x-1/2 rounded-full bg-primary/30 blur-2xl" />
                    </div>
                    <div class="grid grid-cols-2 gap-3 border-t border-border px-4 py-2.5 text-[8px]">
                      <div>
                        <div class="text-[9px] font-semibold">
                          The problem
                        </div>
                        <div class="mt-0.5 leading-snug text-text-secondary">
                          Legacy tools are slow, complex and hard to scale.
                        </div>
                        <ul class="mt-1 space-y-0.5 text-text-secondary">
                          <li>• Too many moving parts</li>
                          <li>• Steep learning curve</li>
                          <li>• Not built for speed</li>
                        </ul>
                      </div>
                      <div>
                        <div class="text-[9px] font-semibold">
                          Our solution
                        </div>
                        <div class="mt-0.5 leading-snug text-text-secondary">
                          A modern, minimal and powerful toolkit for builders.
                        </div>
                        <ul class="mt-1 space-y-0.5 text-text-secondary">
                          <li>• Fast &amp; intuitive</li>
                          <li>• Developer friendly</li>
                          <li>• Built for the future</li>
                        </ul>
                      </div>
                    </div>
                  </article>
                </div>
                <div class="flex items-center justify-between border-t border-border bg-surface px-3 py-1.5 text-[10px] text-text-secondary">
                  <div class="flex items-center gap-1.5">
                    <Icon name="i-lucide-chevron-left" size="11" />
                    <span class="tabular-nums">1 / 9</span>
                    <Icon name="i-lucide-chevron-right" size="11" />
                  </div>
                  <div class="flex items-center gap-1.5">
                    <span>Presenter notes</span>
                    <span class="relative flex h-3.5 w-6 items-center rounded-full bg-primary/20 p-0.5">
                      <span class="ml-auto h-2.5 w-2.5 rounded-full bg-primary shadow-soft" />
                    </span>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Trusted by row -->
    <section class="border-y border-border bg-background py-10">
      <div class="mx-auto max-w-6xl px-6">
        <p class="text-center text-[13px] text-text-secondary">
          Trusted by creators and teams at
        </p>
        <ul class="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-text-secondary">
          <li
            v-for="t in trustedBy"
            :key="t.label"
            class="flex items-center gap-2 text-[15px] font-medium opacity-70 transition hover:opacity-100"
          >
            <Icon :name="t.icon" size="20" />
            {{ t.label }}
          </li>
        </ul>
      </div>
    </section>

    <!-- Features -->
    <section id="features" class="bg-surface">
      <div class="mx-auto max-w-6xl px-6 py-24">
        <div class="mx-auto max-w-2xl text-center">
          <p class="text-[12px] font-semibold tracking-[0.18em] text-primary uppercase">
            Features
          </p>
          <h2 class="mt-3 text-[36px] leading-[1.15] font-semibold tracking-tight lg:text-[40px]">
            Everything you need to make<br>better presentations, faster
          </h2>
        </div>

        <div class="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <article
            v-for="f in features"
            :key="f.title"
            class="flex flex-col rounded-card border border-border bg-surface p-6 shadow-soft transition hover:shadow-md"
          >
            <span class="flex h-9 w-9 items-center justify-center rounded-input bg-primary/10 text-primary">
              <Icon :name="f.icon" size="16" />
            </span>
            <h3 class="mt-5 text-[16px] font-semibold tracking-tight">
              {{ f.title }}
            </h3>
            <p class="mt-2 text-[14px] leading-relaxed text-text-secondary">
              {{ f.body }}
            </p>

            <div class="mt-5">
              <!-- Markdown code -->
              <div v-if="f.variant === 'code'" class="overflow-hidden rounded-input bg-background p-3 font-mono text-[11px] leading-relaxed">
                <div class="text-text-secondary">
                  ---
                </div>
                <div class="text-text-secondary">
                  layout: hero
                </div>
                <div class="text-text-secondary">
                  background: gradient
                </div>
                <div class="text-text-secondary">
                  ---
                </div>
                <div>&nbsp;</div>
                <div class="text-primary">
                  # Hello World
                </div>
                <div>This is a slide.</div>
              </div>

              <!-- Slide layouts mini-thumbs -->
              <div v-else-if="f.variant === 'layouts'" class="grid grid-cols-4 gap-2">
                <div class="aspect-[4/3] rounded border-2 border-primary bg-background" />
                <div class="aspect-[4/3] rounded border border-border bg-background" />
                <div class="aspect-[4/3] rounded border border-border bg-background" />
                <div class="aspect-[4/3] rounded border border-border bg-background" />
                <div class="aspect-[4/3] rounded border border-border bg-background" />
                <div class="aspect-[4/3] rounded border border-border bg-background" />
                <div class="aspect-[4/3] rounded border border-border bg-background" />
                <div class="aspect-[4/3] rounded border border-border bg-background" />
              </div>

              <!-- Preview thumbnail -->
              <div v-else-if="f.variant === 'preview'" class="relative flex aspect-video items-end justify-center overflow-hidden rounded-input bg-background">
                <div class="absolute inset-0 flex items-center justify-center text-center">
                  <div>
                    <p class="text-[11px] font-semibold">
                      Building the future
                    </p>
                    <p class="text-[11px] font-semibold">
                      with <span class="text-primary">modern tools</span>
                    </p>
                  </div>
                </div>
                <div class="absolute right-1/2 -bottom-8 h-20 w-40 translate-x-1/2 rounded-full bg-primary/30 blur-2xl" />
              </div>

              <!-- Keyboard shortcuts -->
              <div v-else-if="f.variant === 'keys'" class="flex items-center gap-2">
                <kbd class="rounded border border-border bg-background px-2.5 py-1.5 font-mono text-[12px] text-text-secondary">⌘K</kbd>
                <kbd class="rounded border border-border bg-background px-2.5 py-1.5 font-mono text-[12px] text-text-secondary">/</kbd>
                <kbd class="rounded border border-border bg-background px-2.5 py-1.5 font-mono text-[12px] text-text-secondary">⌘S</kbd>
              </div>

              <!-- Syntax highlighting code -->
              <div v-else-if="f.variant === 'syntax'" class="overflow-hidden rounded-input bg-background p-3 font-mono text-[11px] leading-relaxed">
                <div class="text-text-secondary">
                  ```ts
                </div>
                <div>
                  <span class="text-primary">const</span> hello <span class="text-text-secondary">=</span> <span class="text-emerald-600">"world"</span>
                </div>
                <div>console.<span class="text-primary">log</span>(hello)</div>
                <div class="text-text-secondary">
                  ```
                </div>
              </div>

              <!-- Export pills -->
              <div v-else-if="f.variant === 'export'" class="flex items-center gap-2">
                <span class="inline-flex items-center gap-1.5 rounded-input border border-red-200 bg-red-50 px-2.5 py-1.5 text-[12px] font-medium text-red-600">
                  <Icon name="i-lucide-file-text" size="13" />
                  PDF
                </span>
                <span class="inline-flex items-center gap-1.5 rounded-input border border-orange-200 bg-orange-50 px-2.5 py-1.5 text-[12px] font-medium text-orange-600">
                  <Icon name="i-lucide-file-text" size="13" />
                  PPTX
                </span>
                <span class="inline-flex items-center gap-1.5 rounded-input border border-primary/20 bg-primary/10 px-2.5 py-1.5 text-[12px] font-medium text-primary">
                  <Icon name="i-lucide-share-2" size="13" />
                  Share
                </span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Templates -->
    <section id="templates" class="bg-background py-20">
      <div class="mx-auto max-w-6xl px-6">
        <div class="rounded-card border border-border bg-surface/70 p-8 lg:p-10">
          <div class="grid gap-10 lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)] lg:items-start lg:gap-12">
            <div class="flex flex-col">
              <p class="text-[12px] font-semibold tracking-[0.18em] text-primary uppercase">
                Templates
              </p>
              <h2 class="mt-3 text-[32px] leading-[1.15] font-semibold tracking-tight">
                Start with beautiful templates
              </h2>
              <p class="mt-4 text-[14px] leading-relaxed text-text-secondary">
                Choose from a growing collection of modern templates for any type of presentation.
              </p>
              <NuxtLink
                to="/sign-in"
                class="mt-6 inline-flex w-fit items-center gap-1.5 text-[14px] font-medium text-primary transition hover:text-primary-hover"
              >
                Browse all templates
                <Icon name="i-lucide-arrow-right" size="14" />
              </NuxtLink>
            </div>

            <div>
              <ul class="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <li
                  v-for="tpl in templates"
                  :key="tpl.label"
                  class="flex flex-col gap-2"
                >
                  <div
                    class="relative aspect-video overflow-hidden rounded-input border border-border"
                    :class="{
                      'bg-gradient-to-br from-indigo-700 via-purple-600 to-fuchsia-500': tpl.style === 'dark-gradient',
                      'bg-stone-50': tpl.style === 'light',
                      'bg-stone-900': tpl.style === 'dark',
                      'bg-gradient-to-br from-violet-200 via-purple-100 to-white': tpl.style === 'violet-gradient',
                    }"
                  >
                    <div
                      class="absolute inset-0 flex items-center justify-center px-3 text-center text-[11px] leading-tight font-semibold"
                      :class="{
                        'text-white': tpl.style === 'dark-gradient' || tpl.style === 'dark',
                        'text-stone-900': tpl.style === 'light',
                        'text-stone-800': tpl.style === 'violet-gradient',
                      }"
                    >
                      <span v-if="tpl.style === 'dark-gradient'">
                        Building the next<br>generation product
                      </span>
                      <span v-else-if="tpl.style === 'dark'">
                        Building fast with<br>modern tooling
                      </span>
                      <span v-else-if="tpl.style === 'violet-gradient'">
                        Our mission is to<br>empower creators
                      </span>
                      <span v-else>
                        {{ tpl.title }}
                      </span>
                    </div>
                  </div>
                  <span class="text-[12px] text-text-secondary">{{ tpl.label }}</span>
                </li>
              </ul>

              <div class="mt-6 flex items-center justify-end gap-2">
                <button
                  type="button"
                  class="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface text-text-secondary transition hover:bg-background"
                  aria-label="Previous templates"
                >
                  <Icon name="i-lucide-chevron-left" size="14" />
                </button>
                <button
                  type="button"
                  class="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface text-text-secondary transition hover:bg-background"
                  aria-label="Next templates"
                >
                  <Icon name="i-lucide-chevron-right" size="14" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Final CTA -->
    <section class="relative overflow-hidden">
      <div class="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-96 bg-gradient-to-t from-primary/[0.08] to-transparent" />
      <div class="mx-auto max-w-3xl px-6 py-24 text-center">
        <h2 class="text-[36px] leading-[1.15] font-semibold tracking-tight lg:text-[40px]">
          Ready to create your best deck?
        </h2>
        <p class="mx-auto mt-4 max-w-md text-[15px] text-text-secondary">
          Join thousands of creators who build presentations the modern way.
        </p>
        <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
          <NuxtLink
            :to="ctaHref"
            class="inline-flex items-center gap-2 rounded-input bg-primary px-6 py-3 text-[14px] font-medium text-white shadow-soft transition hover:bg-primary-hover"
          >
            {{ ctaLabel }}
          </NuxtLink>
          <a
            href="#"
            class="inline-flex items-center gap-1.5 px-3 py-3 text-[14px] font-medium text-text transition hover:text-primary"
          >
            View Pricing
            <Icon name="i-lucide-arrow-right" size="14" />
          </a>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-border bg-background">
      <div class="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-3 text-text-secondary">
          <span class="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white">
            <Icon name="i-lucide-asterisk" size="14" />
          </span>
          <span class="text-[13px] font-semibold tracking-tight text-text">{{ APP_NAME }}</span>
          <span class="text-[12px]">© {{ new Date().getFullYear() }} {{ APP_NAME }}. All rights reserved.</span>
        </div>
        <div class="flex items-center gap-6 text-[13px] text-text-secondary">
          <a
            v-for="link in navLinks"
            :key="link.label"
            :href="link.href"
            class="transition hover:text-text"
          >
            {{ link.label }}
          </a>
        </div>
        <div class="flex items-center gap-3 text-text-secondary">
          <a
            href="#"
            aria-label="Twitter"
            class="transition hover:text-text"
          >
            <Icon name="i-lucide-twitter" size="16" />
          </a>
        </div>
      </div>
    </footer>
  </div>
</template>
