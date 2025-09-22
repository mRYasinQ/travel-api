CREATE TABLE `session` (
	`id` int AUTO_INCREMENT NOT NULL,
	`browser` varchar(30) NOT NULL,
	`device` varchar(30) NOT NULL,
	`user_id` int NOT NULL,
	`token` varchar(80) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`expire_at` timestamp NOT NULL,
	CONSTRAINT `session_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` int AUTO_INCREMENT NOT NULL,
	`first_name` varchar(30) NOT NULL,
	`last_name` varchar(30),
	`email` varchar(255) NOT NULL,
	`username` varchar(40) NOT NULL,
	`password` varchar(200) NOT NULL,
	`is_active` boolean NOT NULL DEFAULT true,
	`is_email_verified` boolean NOT NULL DEFAULT false,
	`joined_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_email_unique` UNIQUE(`email`),
	CONSTRAINT `user_username_unique` UNIQUE(`username`)
);
--> statement-breakpoint
ALTER TABLE `session` ADD CONSTRAINT `session_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE cascade;