PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`username` text NOT NULL,
	`email` text NOT NULL,
	`cellphone` text NOT NULL,
	`address` text NOT NULL,
	`password` text NOT NULL,
	`card_id` text NOT NULL,
	`roles` text DEFAULT '[]',
	`createdAt` integer DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` integer DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
INSERT INTO `__new_users`("id", "name", "username", "email", "cellphone", "address", "password", "card_id", "roles", "createdAt", "updatedAt") SELECT "id", "name", "username", "email", "cellphone", "address", "password", "card_id", "roles", "createdAt", "updatedAt" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_cellphone_unique` ON `users` (`cellphone`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_card_id_unique` ON `users` (`card_id`);