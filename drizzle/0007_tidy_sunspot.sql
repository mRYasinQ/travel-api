ALTER TABLE `user` DROP FOREIGN KEY `user_role_id_role_id_fk`;
--> statement-breakpoint
ALTER TABLE `user` ADD CONSTRAINT `user_role_id_role_id_fk` FOREIGN KEY (`role_id`) REFERENCES `role`(`id`) ON DELETE set null ON UPDATE cascade;