ALTER TABLE `users` ADD `roles` text DEFAULT '[]';--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `role`;