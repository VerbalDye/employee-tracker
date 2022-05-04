const mysql = require('mysql2');

const db = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'SQLtest2022#',
        database: 'company'
});

module.exports = db;