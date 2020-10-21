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
    const { keyword = '' } = req.query
    const sql = 'SELECT * FROM note_table WHERE note_title LIKE ?'
    conn.query(sql, [`%${keyword}%`], (err, result) => {
        if (!err) {
            data = result.map(item => {
                return {
                    noteId: item['note_id'],
                    title: item['note_title'],
                    content: item['note_content']
                }
            });
            res.json({ success: true, data })
        } else {
            res.json({ success: false, msg: err })
        }
    })
});

// 新增
router.post('/add', function (req, res, next) {
    const { title, content } = req.body
    if (title && content) {
        const sql = 'INSERT INTO note_table (note_id,note_title,note_content) VALUES (?,?,?)'
        const id = (new Date()).valueOf().toString()
        conn.query(sql, [id, title, content], (err, result) => {
            if (!err) {
                res.json({ success: true, msg: '成功' })
            } else {
                res.json({ success: false, msg: err })
            }
        })
    } else {
        res.json({ success: false, msg: '缺少参数' })
    }
});



module.exports = router;