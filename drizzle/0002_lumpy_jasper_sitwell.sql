ALTER TABLE `users` RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE `users` RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_book_inventory` (
	`id` integer PRIMARY KEY NOT NULL,
	`book_title_id` integer,
	`quantity` integer NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`book_title_id`) REFERENCES `book_titles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_book_inventory`("id", "book_title_id", "quantity", "created_at", "updated_at") SELECT "id", "book_title_id", "quantity", "created_at", "updated_at" FROM `book_inventory`;--> statement-breakpoint
DROP TABLE `book_inventory`;--> statement-breakpoint
ALTER TABLE `__new_book_inventory` RENAME TO `book_inventory`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_book_titles` (
	`id` integer PRIMARY KEY NOT NULL,
	`image_link` text NOT NULL,
	`name` text NOT NULL,
	`author` text NOT NULL,
	`publisher` text NOT NULL,
	`year` integer NOT NULL,
	`genre` text NOT NULL,
	`slot` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
INSERT INTO `__new_book_titles`("id", "image_link", "name", "author", "publisher", "year", "genre", "slot", "created_at", "updated_at") SELECT "id", "image_link", "name", "author", "publisher", "year", "genre", "slot", "created_at", "updated_at" FROM `book_titles`;--> statement-breakpoint
DROP TABLE `book_titles`;--> statement-breakpoint
ALTER TABLE `__new_book_titles` RENAME TO `book_titles`;--> statement-breakpoint
CREATE TABLE `__new_book_transactions` (
	`id` integer PRIMARY KEY NOT NULL,
	`book_title_id` integer,
	`quantity` integer NOT NULL,
	`borrow_record_id` integer,
	`description` text NOT NULL,
	`user_id` integer,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`book_title_id`) REFERENCES `book_titles`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`borrow_record_id`) REFERENCES `borrow_records`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_book_transactions`("id", "book_title_id", "quantity", "borrow_record_id", "description", "user_id", "created_at") SELECT "id", "book_title_id", "quantity", "borrow_record_id", "description", "user_id", "created_at" FROM `book_transactions`;--> statement-breakpoint
DROP TABLE `book_transactions`;--> statement-breakpoint
ALTER TABLE `__new_book_transactions` RENAME TO `book_transactions`;--> statement-breakpoint
CREATE TABLE `__new_borrow_records` (
	`id` integer PRIMARY KEY NOT NULL,
	`book_title_id` integer,
	`quantity` integer NOT NULL,
	`user_id` integer,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`due_date` text NOT NULL,
	`returned_at` text,
	FOREIGN KEY (`book_title_id`) REFERENCES `book_titles`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_borrow_records`("id", "book_title_id", "quantity", "user_id", "created_at", "due_date", "returned_at") SELECT "id", "book_title_id", "quantity", "user_id", "created_at", "due_date", "returned_at" FROM `borrow_records`;--> statement-breakpoint
DROP TABLE `borrow_records`;--> statement-breakpoint
ALTER TABLE `__new_borrow_records` RENAME TO `borrow_records`;--> statement-breakpoint
CREATE TABLE `__new_deposit_transactions` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` integer,
	`amount` integer NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_deposit_transactions`("id", "user_id", "amount", "created_at") SELECT "id", "user_id", "amount", "created_at" FROM `deposit_transactions`;--> statement-breakpoint
DROP TABLE `deposit_transactions`;--> statement-breakpoint
ALTER TABLE `__new_deposit_transactions` RENAME TO `deposit_transactions`;