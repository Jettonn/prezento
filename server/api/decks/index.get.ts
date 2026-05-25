import { and, desc, eq, isNull } from "drizzle-orm";

import db from "~/lib/db";
import { deck } from "~/lib/db/schema";

export default defineAuthenticatedEventHandler(async (event) => {
  const rows = await db
    .select({
      slug: deck.slug,
      title: deck.title,
      isPublic: deck.isPublic,
      createdAt: deck.createdAt,
      updatedAt: deck.updatedAt,
    })
    .from(deck)
    .where(and(eq(deck.ownerUserId, event.context.user.id), isNull(deck.deletedAt)))
    .orderBy(desc(deck.updatedAt));

  return { decks: rows };
});
