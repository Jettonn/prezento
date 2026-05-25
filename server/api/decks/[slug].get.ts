import { and, eq, isNull, sql } from "drizzle-orm";

import db from "~/lib/db";
import { deck } from "~/lib/db/schema";

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug");
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: "Missing slug" });
  }

  const found = await db.query.deck.findFirst({
    where: and(eq(deck.slug, slug), isNull(deck.deletedAt)),
  });

  if (!found) {
    throw createError({ statusCode: 404, statusMessage: "Deck not found" });
  }

  const isOwner = isDeckOwner(event, found);
  if (!isOwner && !found.isPublic) {
    throw createError({ statusCode: 404, statusMessage: "Deck not found" });
  }

  if (!isOwner) {
    await db
      .update(deck)
      .set({
        viewCount: sql`${deck.viewCount} + 1`,
        lastViewedAt: new Date(),
      })
      .where(eq(deck.id, found.id));
  }

  return {
    slug: found.slug,
    title: found.title,
    markdown: found.markdown,
    isPublic: found.isPublic,
    isOwner,
    createdAt: found.createdAt,
    updatedAt: found.updatedAt,
  };
});
