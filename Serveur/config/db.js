const dotenv = require('dotenv');
dotenv.config();

const mysql = require('mysql2');

const connectConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    PORT: process.env.DB_PORT,
    connectionLimit: 10
};

const connection = mysql.createConnection(connectConfig);

connection.connect((err) => {
    if (err) {
        console.log(err);
        return;
    }
})

module.exports = connection;