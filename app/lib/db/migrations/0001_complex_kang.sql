CREATE TABLE `deck` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`title` text,
	`markdown` text DEFAULT '' NOT NULL,
	`owner_user_id` integer,
	`anon_owner_token` text,
	`deleted_at` integer,
	`view_count` integer DEFAULT 0 NOT NULL,
	`last_viewed_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`owner_user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `deck_slug_unique` ON `deck` (`slug`);--> statement-breakpoint
CREATE INDEX `deck_slug_idx` ON `deck` (`slug`);--> statement-breakpoint
CREATE INDEX `deck_ownerUserId_idx` ON `deck` (`owner_user_id`);