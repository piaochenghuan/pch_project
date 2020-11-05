var db = require('../utils/db_config')
var moment = require('moment');
const path = require('path');
const fs = require('fs');

function getObj(item) {
    return {
        noteId: item['note_id'],
        title: item['note_title'],
        content: item['note_content'],
        createTime: item['create_time'],
        userId: item['user_id'],
        username: item['user_name'],
        userAvatar: item['user_avatar'],
        desc: item['note_desc'],
        images: item['note_images'],
        replyCount: item['reply_count']
    }
}

// 查询所有
function query(req, res, next) {
    const { keyword = '', page = 1, pageSize = 5 } = req.query
    const index = Number(page) * Number(pageSize) - Number(pageSize)
    const sql = `SELECT * FROM note_table a LEFT JOIN user_table b ON  a.user_id=b.user_id WHERE a.note_title LIKE '%${keyword}%' LIMIT ${index},${Number(pageSize)};`
    // 总条数
    const sql2 = `SELECT COUNT(*) FROM note_table WHERE note_title LIKE '%${keyword}%';`
    db.sqlConnect(sql + sql2, [], (err, result) => {
        if (!err) {
            const list = result[0].map(item => {
                return getObj(item)
            });
            res.json({ success: true, data: { list, page: Number(page), pageSize: Number(pageSize), total: result[1][0]['COUNT(*)'] } })
        } else {
            res.json({ success: false, msg: err })
        }
    })
}
// 查询单个用户
function queryMyOwn(req, res, next) {
    const { keyword = '' } = req.query, { userId } = req.userInfo
    const sql = `SELECT * FROM note_table WHERE note_title LIKE '%${keyword}%' AND user_id='${userId}'`
    db.sqlConnect(sql, [], (err, result) => {
        if (!err) {
            const data = result.map(item => {
                return getObj(item)
            });
            res.json({ success: true, data })
        } else {
            res.json({ success: false, msg: err })
        }
    })
}

// 新增
function add(req, res, next) {
    const { title, content, desc = '' } = req.body, { userId, username } = req.userInfo
    if (title && content && userId) {
        let images = []
        // 如果有图片上传
        if (req.files && req.files.length > 0) {
            req.files.forEach(item => {
                // 获取文件扩展名
                const newName = item.path + path.parse(item.originalname).ext;
                // 文件重命名
                fs.renameSync(item.path, newName)
                images.push(newName.replace('public', '').replace(/\\/g, "/"))
            })
        }
        images = images.join(',')
        const id = (new Date()).valueOf().toString()
        const time = moment().format('YYYY-MM-DD hh:mm')
        const sql = `INSERT INTO note_table (note_id,user_id,note_title,note_content,create_time,note_desc,note_images,reply_count) VALUES 
        ('${id}','${userId}','${title}','${content}','${time}','${desc}','${images}',${0})`
        db.sqlConnect(sql, [], (err, result) => {
            if (!err) {
                res.json({ success: true, msg: '成功' })
            } else {
                res.json({ success: false, msg: err })
            }
        })
    } else {
        res.json({ success: false, msg: '缺少参数' })
    }
}
// 删除
function del(req, res, next) {
    const { noteId } = req.body
    if (noteId) {
        const sql = `DELETE FROM note_table WHERE note_id='${noteId}'`
        db.sqlConnect(sql, [], (err, result) => {
            if (!err) {
                res.json({ success: true, msg: '成功' })
            } else {
                res.json({ success: false, msg: err })
            }
        })
    } else {
        res.json({ success: false, msg: '缺少参数' })
    }
}

// 评论回复
function reply(req, res, next) {
    const { content, noteId } = req.body, { userId, username } = req.userInfo
    if (noteId && content) {
        const id = (new Date()).valueOf().toString()
        const time = moment().format('YYYY-MM-DD hh:mm')
        const sql = `INSERT INTO reply_table (reply_id,note_id,user_id,username,reply_content,create_time) VALUES ('${id}','${noteId}','${userId}','${username}','${content}','${time}')`
        db.sqlConnect(sql, [], (err, result) => {
            if (!err) {
                res.json({ success: true, msg: '成功' })
                // 评论总数更新
                const sql = `update note_table SET reply_count = reply_count + 1 WHERE note_id='${noteId}'`
                db.sqlConnect(sql, [], (err, result) => {
                    
                    if (err) {
                        console.log(err)
                    }
                })
            } else {
                res.json({ success: false, msg: err })
            }
        })
    } else {
        res.json({ success: false, msg: '缺少参数' })
    }

}

// 查询回复列表
function queryReplyByNoteId(req, res, next) {
    const { noteId } = req.query, { userId } = req.userInfo
    if (noteId) {
        const sql = `SELECT * FROM reply_table WHERE note_id='${noteId}';`
        db.sqlConnect(sql, [], (err, result) => {
            if (!err) {
                const data = result.map(item => {
                    return {
                        replyId: item['reply_id'],
                        noteId: item['note_id'],
                        content: item['reply_content'],
                        userId: item['user_id'],
                        username: item['username'],
                        createTime: item['create_time']
                    }
                });
                res.json({ success: true, data })
            } else {
                res.json({ success: false, msg: err })
            }
        })

    } else {
        res.json({ success: false, msg: '缺少参数' })
    }
}


module.exports = {
    query,
    queryMyOwn,
    add,
    del,
    reply,
    queryReplyByNoteId
}