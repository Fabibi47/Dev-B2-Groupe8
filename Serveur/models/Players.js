const connection = require('../config/db');

class Players {
    static getPlayer(id) {
        const query = "SELECT * FROM Players WHERE player_id = ?;"
        return new Promise((resolve, reject) => {
            connection.query(query, [id], (err, results) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(results[0]);
                }
            })
        })
    }

    static getPlayers() {
        const query = "SELECT * FROM Players;"
        return new Promise((resolve, reject) => {
            connection.query(query, (err, results) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(results)
                }
            })
        })
    }

    static getPlayerByUsername(username) {
        const query = "SELECT * FROM Players WHERE username = ?;"
        return new Promise((resolve, reject) => {
            connection.query(query, [username], (err, results) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(results[0])
                }
            })
        })
    }

    static addPlayer(username, password) {
        const query = "INSERT INTO Players(username, password) VALUES(?, ?);"
        return new Promise((resolve, reject) => {
            connection.query(query, [username, password], (err, results) => {
                if(err){
                    reject(err)
                } else {
                    resolve(results)
                }
            })
        })
    }

    static updatePlayer(id, username, password) {
        const query = "UPDATE Players SET username = ?, password = ? WHERE player_id = ?";
        return new Promise((resolve, reject) => {
            connection.query(query, [username, password, id], (err, results) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(results)
                }
            })
        })
    }

    static updateMMR(id, mmr) {
        const query = "UPDATE Players SET matchmaking_rating = ? WHERE player_id = ?;"
        return new Promise((resolve, reject) => {
            connection.query(query, [mmr, id], (err, results) => {
                if(err) {
                    reject(err)
                } else {
                    resolve(results)
                }
            })
        })
    }

    static deletePlayer(id) {
        const query = "DELETE FROM Players WHERE player_id = ?;"
        return new Promise((resolve, reject) => {
            connection.query(query, [id], (err, results) => {
                if(err){
                    reject(err)
                } else {
                    resolve(results)
                }
            })
        })
    }
}

module.exports = Players;