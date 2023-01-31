var mysql = require('mysql')
const config = require('config.json');

const MYSQL_DB = mysql.createPool({
    host: 'db4free.net',
    user: 'closhop',
    password: 'Hanoi2021@',
    database: 'closhop_data'
})

module.exports = {MYSQL_DB}
