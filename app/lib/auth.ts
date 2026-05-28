import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createAuthMiddleware } from "better-auth/api";
import { emailOTP } from "better-auth/plugins";
import { Resend } from "resend";

import { APP_NAME } from "./constants";
import db from "./db/index";
import env from "./env";

const resend = new Resend(env.RESEND_API_KEY);

function otpEmailHtml(otp: string): string {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:32px 16px;background:#fafafc;font-family:Inter,system-ui,sans-serif;color:#111111;">
    <table role="presentation" cellspacing="0" cellpadding="0" align="center" width="100%" style="max-width:440px;margin:0 auto;background:#ffffff;border:1px solid #ececf2;border-radius:14px;">
      <tr><td style="padding:32px;">
        <div style="font-size:14px;font-weight:600;letter-spacing:-0.01em;color:#111111;">${APP_NAME}</div>
        <h1 style="margin:24px 0 8px;font-size:22px;font-weight:600;letter-spacing:-0.02em;color:#111111;">Your sign-in code</h1>
        <p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:#6b7280;">Enter this code on the sign-in page to continue. It expires in 5 minutes.</p>
        <div style="display:inline-block;padding:14px 20px;background:#fafafc;border:1px solid #ececf2;border-radius:10px;font-family:'JetBrains Mono',ui-monospace,monospace;font-size:26px;font-weight:600;letter-spacing:0.18em;color:#111111;">${otp}</div>
        <p style="margin:24px 0 0;font-size:12px;line-height:1.6;color:#6b7280;">If you didn't request this, you can safely ignore this email.</p>
      </td></tr>
    </table>
  </body>
</html>`;
}

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      // Normalize unauthenticated /get-session to a stable { session: null, user: null }
      // shape so the client can rely on it. When a session exists, fall through and
      // let better-auth return its default { session, user } payload — that's where
      // user.image lives.
      if (ctx.path === "/get-session" && !ctx.context.session) {
        return ctx.json({
          session: null,
          user: null,
        });
      }
    }),
  },
  database: drizzleAdapter(db, {
    provider: "sqlite",
  }),
  advanced: {
    database: {
      generateId: false,
    },
  },
  socialProviders: {
    google: {
      clientId: env.AUTH_GOOGLE_CLIENT_ID,
      clientSecret: env.AUTH_GOOGLE_CLIENT_SECRET,
    },
  },
  plugins: [
    emailOTP({
      otpLength: 6,
      expiresIn: 5 * 60,
      sendVerificationOTP: async ({ email, otp, type }) => {
        const subject = type === "sign-in"
          ? `Your ${APP_NAME} sign-in code`
          : `Your ${APP_NAME} verification code`;

        const { error } = await resend.emails.send({
          from: env.RESEND_FROM_EMAIL,
          to: email,
          subject,
          html: otpEmailHtml(otp),
        });

        if (error) {
          throw new Error(`Resend send failed: ${error.message ?? error.name}`);
        }
      },
    }),
  ],
});
