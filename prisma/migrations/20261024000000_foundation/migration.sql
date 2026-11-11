-- CreateTable
CREATE TABLE `ServiceGroup` (
    `id` VARCHAR(30) NOT NULL,
    `key` VARCHAR(60) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `tagline` VARCHAR(180) NOT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ServiceGroup_key_key`(`key`),
    INDEX `ServiceGroup_sortOrder_idx`(`sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Service` (
    `id` VARCHAR(30) NOT NULL,
    `groupId` VARCHAR(30) NOT NULL,
    `slug` VARCHAR(120) NOT NULL,
    `name` VARCHAR(120) NOT NULL,
    `shortDescription` VARCHAR(300) NOT NULL,
    `benefit` VARCHAR(240) NOT NULL,
    `headline` VARCHAR(180) NOT NULL,
    `introduction` TEXT NOT NULL,
    `audience` JSON NULL,
    `help` JSON NULL,
    `process` JSON NULL,
    `checklist` JSON NULL,
    `status` ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `metaTitle` VARCHAR(180) NULL,
    `metaDescription` VARCHAR(320) NULL,
    `ogImage` VARCHAR(500) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Service_slug_key`(`slug`),
    INDEX `Service_groupId_status_sortOrder_idx`(`groupId`, `status`, `sortOrder`),
    INDEX `Service_status_updatedAt_idx`(`status`, `updatedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ServiceRelation` (
    `serviceId` VARCHAR(30) NOT NULL,
    `relatedId` VARCHAR(30) NOT NULL,

    INDEX `ServiceRelation_relatedId_idx`(`relatedId`),
    PRIMARY KEY (`serviceId`, `relatedId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Faq` (
    `id` VARCHAR(30) NOT NULL,
    `serviceId` VARCHAR(30) NULL,
    `question` VARCHAR(300) NOT NULL,
    `answer` TEXT NOT NULL,
    `status` ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Faq_serviceId_status_sortOrder_idx`(`serviceId`, `status`, `sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ContentPage` (
    `id` VARCHAR(30) NOT NULL,
    `slug` VARCHAR(120) NOT NULL,
    `title` VARCHAR(180) NOT NULL,
    `summary` VARCHAR(500) NULL,
    `content` JSON NOT NULL,
    `status` ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
    `metaTitle` VARCHAR(180) NULL,
    `metaDescription` VARCHAR(320) NULL,
    `ogImage` VARCHAR(500) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ContentPage_slug_key`(`slug`),
    INDEX `ContentPage_status_updatedAt_idx`(`status`, `updatedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SiteSetting` (
    `id` VARCHAR(30) NOT NULL,
    `key` VARCHAR(120) NOT NULL,
    `value` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `SiteSetting_key_key`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TrustMetric` (
    `id` VARCHAR(30) NOT NULL,
    `value` VARCHAR(100) NOT NULL,
    `label` VARCHAR(160) NOT NULL,
    `detail` VARCHAR(300) NULL,
    `status` ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `TrustMetric_status_sortOrder_idx`(`status`, `sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Testimonial` (
    `id` VARCHAR(30) NOT NULL,
    `quote` TEXT NOT NULL,
    `displayName` VARCHAR(120) NOT NULL,
    `role` VARCHAR(160) NULL,
    `approvedAt` DATETIME(3) NULL,
    `status` ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Testimonial_status_sortOrder_idx`(`status`, `sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Lead` (
    `id` VARCHAR(30) NOT NULL,
    `name` VARCHAR(160) NOT NULL,
    `email` VARCHAR(254) NULL,
    `phone` VARCHAR(40) NULL,
    `nationality` VARCHAR(100) NULL,
    `requirement` TEXT NOT NULL,
    `preferredContact` VARCHAR(20) NOT NULL,
    `preferredTime` VARCHAR(120) NULL,
    `serviceId` VARCHAR(30) NULL,
    `serviceNameAtSubmit` VARCHAR(120) NOT NULL,
    `status` ENUM('NEW', 'CONTACTED', 'QUALIFIED', 'CLOSED', 'ARCHIVED') NOT NULL DEFAULT 'NEW',
    `consentedAt` DATETIME(3) NOT NULL,
    `sourcePath` VARCHAR(500) NULL,
    `contactedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Lead_status_createdAt_idx`(`status`, `createdAt`),
    INDEX `Lead_serviceId_createdAt_idx`(`serviceId`, `createdAt`),
    INDEX `Lead_email_createdAt_idx`(`email`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RateLimitEntry` (
    `id` VARCHAR(30) NOT NULL,
    `keyHash` CHAR(64) NOT NULL,
    `windowStart` DATETIME(3) NOT NULL,
    `hits` INTEGER NOT NULL DEFAULT 1,
    `expiresAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `RateLimitEntry_expiresAt_idx`(`expiresAt`),
    UNIQUE INDEX `RateLimitEntry_keyHash_windowStart_key`(`keyHash`, `windowStart`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(30) NOT NULL,
    `email` VARCHAR(254) NOT NULL,
    `passwordHash` VARCHAR(255) NOT NULL,
    `name` VARCHAR(160) NOT NULL,
    `phone` VARCHAR(40) NULL,
    `role` ENUM('ADMIN', 'EDITOR', 'CLIENT') NOT NULL,
    `status` ENUM('ACTIVE', 'DISABLED') NOT NULL DEFAULT 'ACTIVE',
    `emailVerifiedAt` DATETIME(3) NULL,
    `passwordChangedAt` DATETIME(3) NULL,
    `lastLoginAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    INDEX `User_role_status_idx`(`role`, `status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserSession` (
    `id` VARCHAR(30) NOT NULL,
    `tokenHash` CHAR(64) NOT NULL,
    `userId` VARCHAR(30) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `UserSession_tokenHash_key`(`tokenHash`),
    INDEX `UserSession_userId_expiresAt_idx`(`userId`, `expiresAt`),
    INDEX `UserSession_expiresAt_idx`(`expiresAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ClientCase` (
    `id` VARCHAR(30) NOT NULL,
    `reference` VARCHAR(40) NOT NULL,
    `title` VARCHAR(180) NOT NULL,
    `summary` TEXT NULL,
    `status` ENUM('OPEN', 'IN_PROGRESS', 'WAITING_FOR_CLIENT', 'COMPLETED', 'CLOSED') NOT NULL DEFAULT 'OPEN',
    `clientId` VARCHAR(30) NOT NULL,
    `serviceId` VARCHAR(30) NULL,
    `openedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `closedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ClientCase_reference_key`(`reference`),
    INDEX `ClientCase_clientId_status_updatedAt_idx`(`clientId`, `status`, `updatedAt`),
    INDEX `ClientCase_serviceId_status_idx`(`serviceId`, `status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PortalDocument` (
    `id` VARCHAR(30) NOT NULL,
    `caseId` VARCHAR(30) NOT NULL,
    `uploadedById` VARCHAR(30) NOT NULL,
    `originalName` VARCHAR(255) NOT NULL,
    `storageKey` VARCHAR(500) NOT NULL,
    `mimeType` VARCHAR(120) NOT NULL,
    `sizeBytes` BIGINT NOT NULL,
    `checksum` CHAR(64) NULL,
    `encryptionKeyRef` VARCHAR(120) NOT NULL,
    `status` ENUM('UPLOADED', 'REVIEWED', 'REJECTED', 'ARCHIVED') NOT NULL DEFAULT 'UPLOADED',
    `reviewedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `PortalDocument_storageKey_key`(`storageKey`),
    INDEX `PortalDocument_caseId_status_createdAt_idx`(`caseId`, `status`, `createdAt`),
    INDEX `PortalDocument_uploadedById_createdAt_idx`(`uploadedById`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Appointment` (
    `id` VARCHAR(30) NOT NULL,
    `clientId` VARCHAR(30) NOT NULL,
    `caseId` VARCHAR(30) NULL,
    `startsAt` DATETIME(3) NOT NULL,
    `durationMin` INTEGER NOT NULL DEFAULT 30,
    `timezone` VARCHAR(80) NOT NULL,
    `status` ENUM('REQUESTED', 'CONFIRMED', 'CANCELLED', 'COMPLETED') NOT NULL DEFAULT 'REQUESTED',
    `notes` VARCHAR(1000) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Appointment_clientId_startsAt_idx`(`clientId`, `startsAt`),
    INDEX `Appointment_caseId_startsAt_idx`(`caseId`, `startsAt`),
    INDEX `Appointment_status_startsAt_idx`(`status`, `startsAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notification` (
    `id` VARCHAR(30) NOT NULL,
    `userId` VARCHAR(30) NULL,
    `leadId` VARCHAR(30) NULL,
    `channel` ENUM('EMAIL', 'PORTAL') NOT NULL,
    `status` ENUM('PENDING', 'SENT', 'FAILED') NOT NULL DEFAULT 'PENDING',
    `template` VARCHAR(120) NOT NULL,
    `payload` JSON NULL,
    `sentAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Notification_status_createdAt_idx`(`status`, `createdAt`),
    INDEX `Notification_userId_createdAt_idx`(`userId`, `createdAt`),
    INDEX `Notification_leadId_createdAt_idx`(`leadId`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AuditEvent` (
    `id` VARCHAR(30) NOT NULL,
    `actorId` VARCHAR(30) NULL,
    `action` VARCHAR(120) NOT NULL,
    `entityType` VARCHAR(100) NOT NULL,
    `entityId` VARCHAR(100) NULL,
    `changes` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `AuditEvent_actorId_createdAt_idx`(`actorId`, `createdAt`),
    INDEX `AuditEvent_entityType_entityId_createdAt_idx`(`entityType`, `entityId`, `createdAt`),
    INDEX `AuditEvent_action_createdAt_idx`(`action`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Service` ADD CONSTRAINT `Service_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `ServiceGroup`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServiceRelation` ADD CONSTRAINT `ServiceRelation_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `Service`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServiceRelation` ADD CONSTRAINT `ServiceRelation_relatedId_fkey` FOREIGN KEY (`relatedId`) REFERENCES `Service`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Faq` ADD CONSTRAINT `Faq_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `Service`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lead` ADD CONSTRAINT `Lead_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `Service`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserSession` ADD CONSTRAINT `UserSession_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClientCase` ADD CONSTRAINT `ClientCase_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClientCase` ADD CONSTRAINT `ClientCase_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `Service`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PortalDocument` ADD CONSTRAINT `PortalDocument_caseId_fkey` FOREIGN KEY (`caseId`) REFERENCES `ClientCase`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PortalDocument` ADD CONSTRAINT `PortalDocument_uploadedById_fkey` FOREIGN KEY (`uploadedById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_caseId_fkey` FOREIGN KEY (`caseId`) REFERENCES `ClientCase`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_leadId_fkey` FOREIGN KEY (`leadId`) REFERENCES `Lead`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AuditEvent` ADD CONSTRAINT `AuditEvent_actorId_fkey` FOREIGN KEY (`actorId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
