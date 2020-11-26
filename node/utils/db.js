const mysql = require('mysql')

// const db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '123123',
//     database: 'pch_database',
//     multipleStatements: true
// })

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123123',
    database: 'pch_database',
    multipleStatements: true
})

module.exports = function query(sql, arr = []) {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, conn) => {
            if (err) {
                console.log('连接池连接失败', err);
            } else {
                //执行sql
                conn.query(sql, arr, (err, result) => {
                    if (err) {
                        reject(err.sqlMessage)
                        console.log('sql执行失败', err);
                    } else {
                        resolve(result)
                    }
                })
                // 释放连接
                conn.release()
            }
        })
    })

}












