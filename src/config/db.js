require('dotenv').config();
const mysql = require('mysql2');

conn = {
    dev: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASSWORD
    }
}
const pool = mysql.createPool(conn.dev);

module.exports = pool.promise();