-- CreateTable
CREATE TABLE `checklist_items` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `label` VARCHAR(191) NOT NULL,
    `isRequired` BOOLEAN NOT NULL DEFAULT true,
    `stepId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `document_requirements` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `label` VARCHAR(191) NOT NULL,
    `isRequired` BOOLEAN NOT NULL DEFAULT true,
    `stepId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lead_checklist_responses` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `isChecked` BOOLEAN NOT NULL DEFAULT false,
    `leadId` INTEGER NOT NULL,
    `checklistItemId` INTEGER NOT NULL,

    UNIQUE INDEX `lead_checklist_responses_leadId_checklistItemId_key`(`leadId`, `checklistItemId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lead_documents` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fileUrl` VARCHAR(191) NOT NULL,
    `uploadAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `leadId` INTEGER NOT NULL,
    `requirementId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `checklist_items` ADD CONSTRAINT `checklist_items_stepId_fkey` FOREIGN KEY (`stepId`) REFERENCES `workflow_steps`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `document_requirements` ADD CONSTRAINT `document_requirements_stepId_fkey` FOREIGN KEY (`stepId`) REFERENCES `workflow_steps`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lead_checklist_responses` ADD CONSTRAINT `lead_checklist_responses_leadId_fkey` FOREIGN KEY (`leadId`) REFERENCES `leads`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lead_checklist_responses` ADD CONSTRAINT `lead_checklist_responses_checklistItemId_fkey` FOREIGN KEY (`checklistItemId`) REFERENCES `checklist_items`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lead_documents` ADD CONSTRAINT `lead_documents_leadId_fkey` FOREIGN KEY (`leadId`) REFERENCES `leads`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lead_documents` ADD CONSTRAINT `lead_documents_requirementId_fkey` FOREIGN KEY (`requirementId`) REFERENCES `document_requirements`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
