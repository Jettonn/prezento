import { and, eq, isNull } from "drizzle-orm";

import db from "~/lib/db";
import { deck } from "~/lib/db/schema";

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug");
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: "Missing slug" });
  }

  const found = await db.query.deck.findFirst({
    where: and(eq(deck.slug, slug), isNull(deck.deletedAt)),
    columns: { id: true, ownerUserId: true, anonOwnerToken: true },
  });

  if (!found) {
    throw createError({ statusCode: 404, statusMessage: "Deck not found" });
  }

  if (!isDeckOwner(event, found)) {
    throw createError({ statusCode: 403, statusMessage: "Forbidden" });
  }

  await db
    .update(deck)
    .set({ deletedAt: new Date() })
    .where(eq(deck.id, found.id));

  return { ok: true };
});
