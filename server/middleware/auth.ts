import { auth } from "~/lib/auth";

export default defineEventHandler(async (event) => {
  if (event.path.startsWith("/app") || event.path.startsWith("/api")) {
    const session = await auth.api.getSession({
      headers: event.headers,
    });

    if (session?.user) {
      event.context.session = session.session;
      // Better Auth's getSession returns user.id as a string. Our schema stores
      // it as an INTEGER auto-increment, so every downstream comparison /
      // equality check needs a number. Coerce once, here.
      event.context.user = { ...session.user, id: Number(session.user.id) };
      await claimAnonDecksForUser(event, event.context.user.id);
    }

    if (event.path.startsWith("/app") && !session?.user) {
      await sendRedirect(event, "/", 302);
    }
  }
});
