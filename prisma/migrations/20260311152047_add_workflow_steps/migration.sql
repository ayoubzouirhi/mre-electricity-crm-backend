/*
  Warnings:

  - You are about to drop the column `status` on the `leads` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `leads` DROP COLUMN `status`,
    ADD COLUMN `stepId` INTEGER NULL;

-- CreateTable
CREATE TABLE `workflow_steps` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `color` VARCHAR(191) NULL,
    `order` INTEGER NOT NULL,
    `isFinal` BOOLEAN NOT NULL DEFAULT false,
    `environmentId` INTEGER NOT NULL,

    UNIQUE INDEX `workflow_steps_name_environmentId_key`(`name`, `environmentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `workflow_steps` ADD CONSTRAINT `workflow_steps_environmentId_fkey` FOREIGN KEY (`environmentId`) REFERENCES `environments`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `leads` ADD CONSTRAINT `leads_stepId_fkey` FOREIGN KEY (`stepId`) REFERENCES `workflow_steps`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
