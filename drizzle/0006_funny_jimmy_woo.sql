CREATE TABLE `deposit_transactions` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` integer,
	`amount` integer NOT NULL,
	`createdAt` integer DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
