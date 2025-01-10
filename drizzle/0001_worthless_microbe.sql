CREATE TABLE `book_inventory` (
	`id` integer PRIMARY KEY NOT NULL,
	`book_title_id` integer,
	`quantity` integer NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`book_title_id`) REFERENCES `book_titles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `book_titles` (
	`id` integer PRIMARY KEY NOT NULL,
	`image_link` text NOT NULL,
	`name` text NOT NULL,
	`author` text NOT NULL,
	`publisher` text NOT NULL,
	`year` integer NOT NULL,
	`genre` text NOT NULL,
	`slot` text NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `book_transactions` (
	`id` integer PRIMARY KEY NOT NULL,
	`book_title_id` integer,
	`quantity` integer NOT NULL,
	`borrow_record_id` integer,
	`description` text NOT NULL,
	`user_id` integer,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`book_title_id`) REFERENCES `book_titles`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`borrow_record_id`) REFERENCES `borrow_records`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `borrow_records` (
	`id` integer PRIMARY KEY NOT NULL,
	`book_title_id` integer,
	`quantity` integer NOT NULL,
	`user_id` integer,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP,
	`due_date` integer NOT NULL,
	`returned_at` integer,
	FOREIGN KEY (`book_title_id`) REFERENCES `book_titles`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `deposit_transactions` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` integer,
	`amount` integer NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `users` ADD `username` text NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `email` text NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `cellphone` text NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `address` text NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `password` text NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `card_id` text NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `roles` text DEFAULT '[]';--> statement-breakpoint
ALTER TABLE `users` ADD `createdAt` text DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `users` ADD `updatedAt` text DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_cellphone_unique` ON `users` (`cellphone`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_card_id_unique` ON `users` (`card_id`);