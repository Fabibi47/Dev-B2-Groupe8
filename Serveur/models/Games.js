const connection = require('../config/db');

class Games {
    static getGame(id) {
        const query = "SELECT * FROM Players_Games WHERE game_id = ?;";
        return new Promise((resolve, reject) => {
            connection.query(query, [id], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results[0]);
                }
            })
        })
    }

    static getGameByPlayerId(playerId) {
        const query = "SELECT * FROM Players_Games WHERE player1_id = ? OR player2_id = ?;";
        return new Promise((resolve, reject) => {
            connection.query(query, [playerId, playerId], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results[0]);
                }
            })
        })
    }

    static getGames() {
        const query = "SELECT * FROM Games;";
        return new Promise((resolve, reject) => {
            connection.query(query, (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            })
        })
    }

    static getStatus(id) {
        const query = "SELECT game_status FROM Games WHERE game_id = ?";
        return new Promise((resolve, reject) => {
            connection.query(query, [id], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            })
        })
    }

    static createGame(player1, player2) {
        const query = "INSERT INTO Players_Games (player1_id, player2_id) VALUES (?, ?);";
        return new Promise((resolve, reject) => {
            connection.query(query, [player1, player2], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results[0]);
                }
            })
        })
    }

    static delGame(id) {
        const query = "DELETE FROM Games WHERE game_id = ?;";
        return new Promise((resolve, reject) => {
            connection.query(query, [id], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            })
        })
    }

    static updateGame(id, board) {
        const query = "UPDATE Players_Games SET Board = ? WHERE game_id = ?;";
        return new Promise((resolve, reject) => {
            connection.query(query, [board, id], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            })
        })
    }
}

module.exports = Games;