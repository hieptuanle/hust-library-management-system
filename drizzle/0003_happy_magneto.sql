ALTER TABLE `users` ADD `cellphone` text;--> statement-breakpoint
ALTER TABLE `users` ADD `address` text;--> statement-breakpoint
ALTER TABLE `users` ADD `studentId` text;--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_cellphone_unique` ON `users` (`cellphone`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_studentId_unique` ON `users` (`studentId`);