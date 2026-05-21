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

  await db
    .update(deck)
    .set({
      viewCount: sql`${deck.viewCount} + 1`,
      lastViewedAt: new Date(),
    })
    .where(eq(deck.id, found.id));

  return {
    slug: found.slug,
    title: found.title,
    markdown: found.markdown,
    createdAt: found.createdAt,
    updatedAt: found.updatedAt,
  };
});
