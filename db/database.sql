CREATE TABLE IF NOT EXISTS Players(
    player_id INTEGER NOT NULL AUTO_INCREMENT,
    username VARCHAR(15) NOT NULL,
    password VARCHAR(255) NOT NULL,
    matchmaking_rating INTEGER DEFAULT 500,
    PRIMARY KEY(player_id)
);

CREATE TABLE IF NOT EXISTS Waiting-List(
    player_id INTEGER NOT NULL,
    entered_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(player_id),
    FOREIGN KEY(player_id) REFERENCES Players(player_id)
);

CREATE TABLE IF NOT EXISTS Players-Games(
    game_id INTEGER NOT NULL AUTO_INCREMENT,
    player1_id INTEGER NOT NULL,
    player2_id INTEGER NOT NULL,
    PRIMARY KEY(game_id),
    FOREIGN KEY(player1_id) REFERENCES Players(player_id),
    FOREIGN KEY(player2_id) REFERENCES Players(player_id)
);

CREATE TABLE IF NOT EXISTS Games(
    game_id INTEGER NOT NULL AUTO_INCREMENT,
    game_board VARCHAR(9) NOT NULL,
    game_status VARCHAR(15) NOT NULL,
    game_result VARCHAR(15) NOT NULL,
    PRIMARY KEY(game_id),
    FOREIGN KEY(game_id) REFERENCES Player-Game(game_id)
);

CREATE TABLE IF NOT EXISTS Turns(
    turn_id INTEGER NOT NULL AUTO_INCREMENT,
    game_id INTEGER NOT NULL,
    player_id INTEGER NOT NULL,
    move_played VARCHAR(9) NOT NULL,
    PRIMARY KEY(turn_id),
    FOREIGN KEY(game_id) REFERENCES Games(game_id),
    FOREIGN KEY(player_id) REFERENCES Players(player_id)
);