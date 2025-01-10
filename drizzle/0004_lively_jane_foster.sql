ALTER TABLE `users` RENAME COLUMN "studentId" TO "card_id";--> statement-breakpoint
DROP INDEX `users_studentId_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `users_card_id_unique` ON `users` (`card_id`);