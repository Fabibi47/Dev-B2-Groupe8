CREATE DATABASE IF NOT EXISTS TTTMatchmaking CHARACTER SET = utf8mb4;

CREATE USER IF NOT EXISTS 'ttt_admin'@'localhost' IDENTIFIED BY 'T;cT4cT0e4dm;nP455w0rd';

GRANT ALL PRIVILEGES ON TTTMatchmaking.* TO 'ttt_admin'@'localhost';