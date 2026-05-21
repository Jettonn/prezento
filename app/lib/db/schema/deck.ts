import { relations } from "drizzle-orm";
import { index, int, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { user } from "./auth";

export const deck = sqliteTable(
  "deck",
  {
    id: int().primaryKey({ autoIncrement: true }),
    slug: text().notNull().unique(),
    title: text(),
    markdown: text().notNull().default(""),
    ownerUserId: int().references(() => user.id, { onDelete: "cascade" }),
    anonOwnerToken: text(),
    deletedAt: integer({ mode: "timestamp_ms" }),
    viewCount: integer().default(0).notNull(),
    lastViewedAt: integer({ mode: "timestamp_ms" }),
    createdAt: integer()
      .notNull(),
    updatedAt: integer()
      .$onUpdate(() => Date.now())
      .notNull(),
  },
  table => [
    index("deck_slug_idx").on(table.slug),
    index("deck_ownerUserId_idx").on(table.ownerUserId),
  ],
);

export const deckRelations = relations(deck, ({ one }) => ({
  owner: one(user, {
    fields: [deck.ownerUserId],
    references: [user.id],
  }),
}));
