CREATE TABLE `community_projects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ownerId` int NOT NULL,
	`title` varchar(180) NOT NULL,
	`description` text NOT NULL,
	`level` enum('Pemula','Menengah','Mahir') NOT NULL DEFAULT 'Pemula',
	`status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
	`moderatorNote` text,
	`submittedAt` timestamp NOT NULL DEFAULT (now()),
	`moderatedAt` timestamp,
	`moderatedBy` int,
	CONSTRAINT `community_projects_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `stored_files` ADD `projectId` int;