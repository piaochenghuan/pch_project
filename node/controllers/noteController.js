var query = require('../utils/db_config')
var moment = require('moment');
const path = require('path');
const fs = require('fs');

// 查询所有
function queryNote(req, res, next) {
    const { keyword = '', page = 1, pageSize = 5 } = req.query
    const index = Number(page) * Number(pageSize) - Number(pageSize)
    const sql = `SELECT * FROM note_table a LEFT JOIN user_table b ON  a.user_id=b.user_id WHERE a.note_title LIKE '%${keyword}%' LIMIT ${index},${Number(pageSize)};`
    // 总条数
    const sql2 = `SELECT COUNT(*) FROM note_table WHERE note_title LIKE '%${keyword}%';`
    query(sql + sql2)
        .then(result => {
            const list = result[0].map(item => {
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
            });
            res.json({ success: true, data: { list, page: Number(page), pageSize: Number(pageSize), total: result[1][0]['COUNT(*)'] } })
        })
        .catch(err => res.json({ success: false, msg: err }))
}


// 查询单个用户
function queryMyOwn(req, res, next) {
    const { keyword = '' } = req.query, { userId } = req.userInfo
    const sql = `SELECT * FROM note_table WHERE note_title LIKE '%${keyword}%' AND user_id='${userId}'`
    query(sql)
        .then(result => {
            const data = result.map(item => {
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
            });
            res.json({ success: true, data })
        })
        .catch(err => res.json({ success: false, msg: err }))
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
        query(sql)
            .then(result => {
                res.json({ success: true, msg: '成功' })
            })
            .catch(err => res.json({ success: false, msg: err }))
    } else {
        res.json({ success: false, msg: '缺少参数' })
    }
}
// 删除
function del(req, res, next) {
    const { noteId } = req.body
    if (noteId) {
        const sql = `DELETE FROM note_table WHERE note_id='${noteId}'`
        query(sql + sql2)
            .then(result => {
                res.json({ success: true, msg: '成功' })
            })
            .catch(err => res.json({ success: false, msg: err }))
    } else {
        res.json({ success: false, msg: '缺少参数' })
    }
}

// 评论回复
async function reply(req, res, next) {
    const { content, noteId, replyId } = req.body, { userId, username, userAvatar } = req.userInfo
    if (noteId && content) {
        const id = (new Date()).valueOf().toString()
        const time = moment().format('YYYY-MM-DD hh:mm')
        let toUserId = ''
        let toUsername = ''
        // 如果是回复对方评论
        if (replyId) {
            // 查询被评论的 评论信息
            const sql = `select * from reply_table where reply_id= '${replyId}'`
            const result = await query(sql)
            toUserId = result[0]['user_id']
            toUsername = result[0]['username']
        }

        const sql = `INSERT INTO reply_table (reply_id,note_id,user_id,username,user_avatar,reply_content,create_time,to_user_id,to_username) VALUES 
        ('${id}','${noteId}','${userId}','${username}','${userAvatar}','${content}','${time}','${toUserId}','${toUsername}')`
        await query(sql)
            .then(result => res.json({ success: true, msg: '成功' }))
            .catch(err => res.json({ success: false, msg: err }))

        // 新增成功后更新 回复总数
        // 查询总条数
        const sql2 = `SELECT COUNT(*) FROM note_table WHERE note_id = '${noteId}'`
        const result2 = await query(sql2)
        // 评论总数更新
        const sql3 = `update note_table set reply_count = ${result2[0]['COUNT(*)']} WHERE note_id='${noteId}'`
        query(sql3).catch(err => console.log(err))
    } else {
        res.json({ success: false, msg: '缺少参数' })
    }
}

// 查询回复列表
function queryReplyByNoteId(req, res, next) {
    const { noteId } = req.query, { userId } = req.userInfo
    if (noteId) {
        const sql = `SELECT * FROM reply_table WHERE note_id='${noteId}';`
        query(sql)
            .then(result => {
                const data = result.map(item => {
                    return {
                        replyId: item['reply_id'],
                        noteId: item['note_id'],
                        content: item['reply_content'],
                        userId: item['user_id'],
                        username: item['username'],
                        createTime: item['create_time'],
                        toUsername: item['to_username'],
                        toUserId: item['to_user_id'],
                        userAvatar: item['user_avatar'],
                    }
                });
                res.json({ success: true, data })
            })
            .catch(err => res.json({ success: false, msg: err }))
    } else {
        res.json({ success: false, msg: '缺少参数' })
    }
}

module.exports = {
    queryNote,
    queryMyOwn,
    add,
    del,
    reply,
    queryReplyByNoteId
}