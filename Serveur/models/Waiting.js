const connection = require('../config/db');

class Waiting {
    static getWaitings(minMMR, maxMMR) {
        const query = "SELECT Waiting_List.player_id FROM Waiting_List JOIN Players ON Waiting_List.player_id = Players.player_id WHERE matchmaking_rating BETWEEN ? AND ?;";
        return new Promise((resolve, reject) => {
            connection.query(query, [minMMR, maxMMR], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            })
        })
    }

    static delWaiting(id) {
        const query = "DELETE FROM Waiting_List WHERE player_id = ?;";
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

    static createWaiting(id) {
        const query = "INSERT INTO Waiting_List (player_id) VALUES (?);";
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
}

module.exports = Waiting;