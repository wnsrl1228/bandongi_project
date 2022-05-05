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

// function getConnection(callback) {
//     pool.getConnection(function (err, conn) {
//         if(!err) {
//             callback(conn);
//         } else {
//             console.log('db객체 생성 오류');
//         }
//     });
// }
module.exports = pool.promise();
// module.exports = getConnection;