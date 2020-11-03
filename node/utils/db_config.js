// 1.导入mysql模块
const mysql = require('mysql')


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123123',
    database: 'pch_database',
    multipleStatements: true
})


module.exports = {
    config: {
        host: 'localhost',
        user: 'root',
        password: '123123',
        database: 'pch_database',
        multipleStatements: true
    },
    sqlConnect: function (sql, sqlArr, callback) {
        const pool = mysql.createPool(this.config)
        pool.getConnection((err, conn) => {
            if (err) {

            } else {
                //执行sql
                conn.query(sql, sqlArr, callback)
                // 释放连接
                conn.release()
            }
        })
    }
    // sqlConnect: (sql, sqlArr, callback) => {
    //     db.query(sql, sqlArr, callback)
    // }
}










