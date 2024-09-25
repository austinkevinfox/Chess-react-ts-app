-- CreateTable
CREATE TABLE `Game` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `location` VARCHAR(191) NULL,
    `white` VARCHAR(191) NOT NULL,
    `black` VARCHAR(191) NOT NULL,
    `winner` VARCHAR(191) NULL,
    `url` VARCHAR(191) NULL,
    `isDraw` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `Game_title_key`(`title`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
