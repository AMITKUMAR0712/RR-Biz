ALTER TABLE `User`
    MODIFY `role` ENUM('ADMIN', 'MANAGER', 'EDITOR', 'CLIENT') NOT NULL;

ALTER TABLE `CustomerFeedback`
    ADD COLUMN `status` ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
    ADD COLUMN `reviewedAt` DATETIME(3) NULL,
    ADD COLUMN `approvedAt` DATETIME(3) NULL;

UPDATE `CustomerFeedback`
SET `status` = 'PUBLISHED', `approvedAt` = `createdAt`, `reviewedAt` = `createdAt`;

CREATE INDEX `CustomerFeedback_status_createdAt_idx`
    ON `CustomerFeedback`(`status`, `createdAt`);
