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
    // eslint-disable-next-line no-console
    console.warn("[deck.get] 404 ownership check failed", {
      slug,
      hasUser: !!event.context.user,
      userId: event.context.user?.id ?? null,
      deckOwnerUserId: found.ownerUserId,
      deckIsPublic: found.isPublic,
      hasCookieHeader: !!event.headers.get("cookie"),
      cookieNames: (event.headers.get("cookie") ?? "")
        .split(";")
        .map(s => s.trim().split("=")[0])
        .filter(Boolean),
    });
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
