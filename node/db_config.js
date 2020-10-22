// 1.导入mysql模块
const mysql = require('mysql')
// 2.创建mysql的连接对象
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123123',
    database: 'pch_database',
    multipleStatements: true
})

module.exports = db
