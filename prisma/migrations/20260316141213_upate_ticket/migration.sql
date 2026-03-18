/*
  Warnings:

  - You are about to drop the column `ladId` on the `tickets` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `tickets` DROP FOREIGN KEY `tickets_ladId_fkey`;

-- AlterTable
ALTER TABLE `tickets` DROP COLUMN `ladId`,
    ADD COLUMN `leadId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `tickets` ADD CONSTRAINT `tickets_leadId_fkey` FOREIGN KEY (`leadId`) REFERENCES `leads`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
