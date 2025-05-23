-- CreateTable
CREATE TABLE `games` (
    `game_id` INTEGER NOT NULL AUTO_INCREMENT,
    `game_board` VARCHAR(9) NOT NULL,
    `game_status` VARCHAR(15) NOT NULL,
    `game_result` VARCHAR(15) NOT NULL,

    PRIMARY KEY (`game_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `players` (
    `player_id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(15) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `matchmaking_rating` INTEGER NULL DEFAULT 500,

    PRIMARY KEY (`player_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `players_games` (
    `game_id` INTEGER NOT NULL AUTO_INCREMENT,
    `player1_id` INTEGER NOT NULL,
    `player2_id` INTEGER NOT NULL,

    INDEX `player1_id`(`player1_id`),
    INDEX `player2_id`(`player2_id`),
    PRIMARY KEY (`game_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `turns` (
    `turn_id` INTEGER NOT NULL AUTO_INCREMENT,
    `game_id` INTEGER NOT NULL,
    `player_id` INTEGER NOT NULL,
    `move_played` VARCHAR(9) NOT NULL,

    INDEX `game_id`(`game_id`),
    INDEX `player_id`(`player_id`),
    PRIMARY KEY (`turn_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `waiting_list` (
    `player_id` INTEGER NOT NULL,
    `entered_date` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`player_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

