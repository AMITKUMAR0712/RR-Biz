CREATE TABLE `BlogPost` (
    `id` VARCHAR(30) NOT NULL,
    `slug` VARCHAR(120) NOT NULL,
    `category` VARCHAR(100) NOT NULL,
    `title` VARCHAR(180) NOT NULL,
    `introduction` TEXT NOT NULL,
    `prompts` JSON NULL,
    `serviceSlug` VARCHAR(120) NOT NULL,
    `image` VARCHAR(500) NULL,
    `status` ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `metaTitle` VARCHAR(180) NULL,
    `metaDescription` VARCHAR(320) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    UNIQUE INDEX `BlogPost_slug_key`(`slug`),
    INDEX `BlogPost_status_sortOrder_idx`(`status`, `sortOrder`),
    INDEX `BlogPost_status_updatedAt_idx`(`status`, `updatedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `Testimonial`
    ADD COLUMN `rating` INTEGER NULL,
    ADD COLUMN `sourceUrl` VARCHAR(500) NULL,
    ADD COLUMN `reviewedAt` DATETIME(3) NULL;

UPDATE `Service`
SET `status` = 'PUBLISHED'
WHERE `slug` IN (
    'business-setup',
    'pro-services',
    'bank-account-assistance',
    'document-services',
    'visa-processing-support',
    'international-visa-support',
    'accounting-bookkeeping',
    'recruitment',
    'it-services',
    'digital-marketing'
);
