<script setup lang="ts">
import { APP_NAME } from "~/lib/constants";

const authStore = useAuthStore();

await authStore.init();
if (authStore.user) {
  await navigateTo("/app");
}

type Step = "email" | "code";

const step = ref<Step>("email");
const email = ref("");
const otp = ref("");

const sending = ref(false);
const verifying = ref(false);
const googleLoading = ref(false);
const errorMessage = ref("");
const resentAt = ref<number | null>(null);

const codeRef = useTemplateRef<HTMLInputElement>("codeInput");

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+$/;
const NON_DIGIT = /\D/g;

function emailLooksValid(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

async function handleSendCode() {
  errorMessage.value = "";
  if (!emailLooksValid(email.value)) {
    errorMessage.value = "Enter a valid email.";
    return;
  }
  sending.value = true;
  try {
    await authStore.sendOtp(email.value.trim());
    step.value = "code";
    resentAt.value = null;
    await nextTick();
    codeRef.value?.focus();
  }
  catch (err) {
    errorMessage.value = err instanceof Error ? err.message : "Failed to send code.";
  }
  finally {
    sending.value = false;
  }
}

async function handleResend() {
  errorMessage.value = "";
  sending.value = true;
  try {
    await authStore.sendOtp(email.value.trim());
    resentAt.value = Date.now();
  }
  catch (err) {
    errorMessage.value = err instanceof Error ? err.message : "Failed to resend code.";
  }
  finally {
    sending.value = false;
  }
}

async function handleVerify() {
  errorMessage.value = "";
  const code = otp.value.trim();
  if (code.length !== 6) {
    errorMessage.value = "Enter the 6-digit code.";
    return;
  }
  verifying.value = true;
  try {
    await authStore.verifyOtp(email.value.trim(), code);
    await navigateTo("/app");
  }
  catch (err) {
    errorMessage.value = err instanceof Error ? err.message : "Invalid or expired code.";
  }
  finally {
    verifying.value = false;
  }
}

function backToEmail() {
  step.value = "email";
  otp.value = "";
  errorMessage.value = "";
}

async function handleGoogle() {
  googleLoading.value = true;
  try {
    await authStore.signIn();
  }
  finally {
    googleLoading.value = false;
  }
}

function onOtpInput(e: Event) {
  const value = (e.target as HTMLInputElement).value.replace(NON_DIGIT, "").slice(0, 6);
  otp.value = value;
  if (value.length === 6) {
    void handleVerify();
  }
}
</script>

<template>
  <main class="flex min-h-screen items-center justify-center bg-background px-6 py-12">
    <div class="w-full max-w-md">
      <NuxtLink to="/" class="mb-8 flex items-center justify-center gap-2">
        <span class="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
          <Icon name="i-lucide-asterisk" size="18" />
        </span>
        <span class="text-[15px] font-semibold tracking-tight text-text">{{ APP_NAME }}</span>
      </NuxtLink>

      <div class="rounded-card border border-border bg-surface p-8 shadow-soft sm:p-10">
        <h1 class="text-center text-[24px] font-semibold tracking-tight text-text">
          {{ step === "email" ? `Sign in to ${APP_NAME}` : "Check your email" }}
        </h1>
        <p class="mt-2 text-center text-[14px] text-text-secondary">
          <template v-if="step === 'email'">
            We'll email you a 6-digit code.
          </template>
          <template v-else>
            We sent a code to <span class="font-medium text-text">{{ email }}</span>.
          </template>
        </p>

        <!-- Step 1: email -->
        <form
          v-if="step === 'email'"
          class="mt-8 flex flex-col gap-3"
          @submit.prevent="handleSendCode"
        >
          <label class="flex flex-col gap-1.5">
            <span class="text-[13px] font-medium text-text-secondary">Email</span>
            <input
              v-model="email"
              type="email"
              autocomplete="email"
              required
              :disabled="sending"
              placeholder="you@example.com"
              class="rounded-input border border-border bg-background px-3 py-2.5 text-[14px] text-text outline-none transition placeholder:text-text-secondary/70 focus:border-primary/40 focus:bg-surface focus:ring-2 focus:ring-primary/15 disabled:opacity-60"
            >
          </label>

          <button
            type="submit"
            :disabled="sending || !email"
            class="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-input bg-primary px-4 py-2.5 text-[14px] font-medium text-white shadow-soft transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Icon
              v-if="sending"
              name="i-lucide-loader-2"
              class="animate-spin"
              size="16"
            />
            {{ sending ? "Sending…" : "Send code" }}
          </button>
        </form>

        <!-- Step 2: code -->
        <form
          v-else
          class="mt-8 flex flex-col gap-3"
          @submit.prevent="handleVerify"
        >
          <label class="flex flex-col gap-1.5">
            <span class="text-[13px] font-medium text-text-secondary">6-digit code</span>
            <input
              ref="codeInput"
              :value="otp"
              type="text"
              inputmode="numeric"
              autocomplete="one-time-code"
              maxlength="6"
              required
              :disabled="verifying"
              placeholder="••••••"
              class="rounded-input border border-border bg-background px-3 py-3 text-center font-mono text-[20px] tracking-[0.5em] text-text outline-none transition placeholder:text-text-secondary/40 focus:border-primary/40 focus:bg-surface focus:ring-2 focus:ring-primary/15 disabled:opacity-60"
              @input="onOtpInput"
            >
          </label>

          <button
            type="submit"
            :disabled="verifying || otp.length !== 6"
            class="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-input bg-primary px-4 py-2.5 text-[14px] font-medium text-white shadow-soft transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Icon
              v-if="verifying"
              name="i-lucide-loader-2"
              class="animate-spin"
              size="16"
            />
            {{ verifying ? "Verifying…" : "Verify and sign in" }}
          </button>

          <div class="mt-1 flex items-center justify-between text-[12px] text-text-secondary">
            <button
              type="button"
              class="inline-flex items-center gap-1 transition hover:text-text"
              @click="backToEmail"
            >
              <Icon name="i-lucide-arrow-left" size="12" />
              Use a different email
            </button>
            <button
              type="button"
              :disabled="sending"
              class="transition hover:text-text disabled:opacity-60"
              @click="handleResend"
            >
              {{ resentAt ? "Code resent" : "Resend code" }}
            </button>
          </div>
        </form>

        <p
          v-if="errorMessage"
          class="mt-4 rounded-input border border-red-200 bg-red-50 px-3 py-2 text-[13px] text-red-700"
        >
          {{ errorMessage }}
        </p>

        <div v-if="step === 'email'" class="mt-8 flex items-center gap-3 text-[11px] text-text-secondary">
          <span class="h-px flex-1 bg-border" />
          <span class="tracking-[0.18em] uppercase">Or</span>
          <span class="h-px flex-1 bg-border" />
        </div>

        <button
          v-if="step === 'email'"
          type="button"
          :disabled="googleLoading"
          class="mt-6 inline-flex w-full items-center justify-center gap-3 rounded-input border border-border bg-surface px-4 py-2.5 text-[14px] font-medium text-text shadow-soft transition hover:bg-background disabled:cursor-not-allowed disabled:opacity-60"
          @click="handleGoogle"
        >
          <svg
            viewBox="0 0 48 48"
            width="18"
            height="18"
            aria-hidden="true"
          >
            <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
            <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
            <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
            <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
          </svg>
          Continue with Google
        </button>

        <p class="mt-8 border-t border-border pt-6 text-center text-[12px] text-text-secondary">
          By continuing you agree to our
          <a href="#" class="text-primary hover:underline">Terms</a>
          and
          <a href="#" class="text-primary hover:underline">Privacy Policy</a>.
        </p>
      </div>

      <p class="mt-8 text-center text-[12px] text-text-secondary">
        © {{ new Date().getFullYear() }} {{ APP_NAME }}
      </p>
    </div>
  </main>
</template>
