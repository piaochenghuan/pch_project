var express = require('express');
var router = express.Router();
var db = require('../db_config')
var moment = require('moment');

router.get('/', function (req, res, next) {
    next()
});

// 查询
router.get('/query', function (req, res, next) {
    const { keyword = '', page = 1, pageSize = 20 } = req.query
    const start = Number(page) * 20 - 20
    const end = start + Number(pageSize)
    const sql = `SELECT * FROM note_table WHERE note_title LIKE '%${keyword}%' LIMIT ${start},${end};`
    // 总条数
    const sql2 = `SELECT COUNT(*) FROM note_table WHERE note_title LIKE '%${keyword}%';`
    db.query(sql + sql2, (err, result) => {
        if (!err) {
            const list = result[0].map(item => {
                return {
                    noteId: item['note_id'],
                    title: item['note_title'],
                    content: item['note_content'],
                    username: item['user_name'],
                    createTime: item['create_time'],
                }
            });
            res.json({ success: true, data: { list, page: Number(page), pageSize: Number(pageSize), total: result[1][0]['COUNT(*)'] } })
        } else {
            res.json({ success: false, msg: err })
        }
    })
});
// 查询个人的
router.get('/queryMyOwn', function (req, res, next) {
    const { keyword = '' } = req.query, { userId } = req.userInfo
    const sql = `SELECT * FROM note_table WHERE note_title LIKE '%${keyword}%' AND user_id='${userId}'`
    db.query(sql, (err, result) => {
        if (!err) {
            const data = result.map(item => {
                return {
                    noteId: item['note_id'],
                    userId: item['user_id'],
                    title: item['note_title'],
                    content: item['note_content'],
                    createTime: item['create_time'],
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
    const { title, content } = req.body, { userId, username } = req.userInfo
    if (title && content && userId) {
        const id = (new Date()).valueOf().toString()
        const time = moment().format('YYYY-MM-DD hh:mm')
        const sql = `INSERT INTO note_table (note_id,user_id,note_title,note_content,user_name,create_time) VALUES ('${id}','${userId}','${title}','${content}','${username}','${time}')`
        db.query(sql, (err, result) => {
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


// 删除
router.post('/delete', function (req, res, next) {
    const { noteId } = req.body
    if (noteId) {
        const sql = `DELETE FROM note_table WHERE note_id='${noteId}'`
        db.query(sql, (err, result) => {
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