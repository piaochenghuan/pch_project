var express = require('express');
var router = express.Router();


// 1.导入mysql模块
const mysql = require('mysql')
// 2.创建mysql的连接对象
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123123',
    database: 'pch_database'
})


router.get('/', function (req, res, next) {
    next()
});

// 查询
router.get('/query', function (req, res, next) {
    const sql = 'SELECT * FROM note_table'
    conn.query(sql, (err, result) => {
        if (!err) {
            console.log(11111, result);
            data = result.map(item => {
                return {
                    title: item['note_title'],
                    content: item['note_content']
                }
            });
            res.json({ success: false, data })
        } else {
            res.json({ success: false, msg: err })
        }
    })
});

// 新增
router.post('/add', function (req, res, next) {

});



module.exports = router;