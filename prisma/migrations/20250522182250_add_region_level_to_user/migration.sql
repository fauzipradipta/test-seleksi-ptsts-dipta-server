/*
  Warnings:

  - Added the required column `regionLevel` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_regionId_fkey`;

-- DropIndex
DROP INDEX `User_regionId_fkey` ON `user`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `regionLevel` ENUM('PUSAT', 'PROVINSI', 'KABUPATEN', 'KECAMATAN', 'KELURAHAN') NOT NULL,
    MODIFY `regionId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_regionId_fkey` FOREIGN KEY (`regionId`) REFERENCES `Region`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
