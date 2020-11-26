var query = require('../utils/db')
var moment = require('moment');
const path = require('path');
const fs = require('fs');

// 查询所有
function queryNote(req, res, next) {
    const { keyword = '', userId = '', page = 1, pageSize = 5 } = req.query
    const index = Number(page) * Number(pageSize) - Number(pageSize)
    const sql = `
        select
        n.note_id,
        n.note_title,
        n.note_content,
        n.note_desc,
        n.user_id,
        n.create_time,
        n.note_images,
        n.reply_count,
        u.user_name,
        u.user_avatar
        from
        note_table as n
        left join user_table as u on n.user_id = u.user_id
        where
        n.note_title like '%${keyword}%' 
        and
        n.user_id like '%${userId}%'
        limit ${index},${Number(pageSize)};
    `
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
                    desc: item['note_desc'],
                    images: item['note_images'],
                    replyCount: item['reply_count'],
                    userId: item['user_id'],
                    username: item['user_name'],
                    userAvatar: item['user_avatar'],
                }
            });
            res.json({
                success: true,
                data: {
                    list,
                    page: Number(page),
                    pageSize: Number(pageSize),
                    total: result[1][0]['COUNT(*)']
                }
            })
        })
        .catch(err => res.json({ success: false, msg: err }))
}


// 新增
function add(req, res, next) {
    const { title, content, desc = '' } = req.body, { userId } = req.userInfo
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
        const sql = `
            DELETE FROM 
            note_table 
            WHERE 
            note_id='${noteId}'
        `
        query(sql)
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
    const { content, noteId, replyId } = req.body, { userId } = req.userInfo
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

        // 新增后更新评论总数
        const sql = `INSERT INTO reply_table (reply_id,note_id,reply_content,create_time,user_id,to_user_id) VALUES 
        ('${id}','${noteId}','${content}','${time}','${userId}','${toUserId}');`
        const sql2 = `update note_table set reply_count = reply_count+1 WHERE note_id='${noteId}'`
        query(sql + sql2)
            .then(result => res.json({ success: true, msg: '成功' }))
            .catch(err => res.json({ success: false, msg: err }))
    } else {
        res.json({ success: false, msg: '缺少参数' })
    }
}

// 查询回复列表
function queryReplyByNoteId(req, res, next) {
    const { noteId } = req.query
    if (noteId) {
        const sql = `
            select
            r.reply_id,
            r.note_id,
            r.reply_content,
            r.create_time,
            r.to_user_id,
            r.user_id,
            u.user_name,
            u.user_avatar,
            u2.user_name as to_user_name
            from
            reply_table as r
            left join user_table as u on r.user_id = u.user_id
            left join user_table as u2 on r.to_user_id = u2.user_id
            where 
            r.note_id = '${noteId}'
        `
        query(sql)
            .then(result => {
                const data = result.map(item => {

                    return {
                        replyId: item['reply_id'],
                        noteId: item['note_id'],
                        content: item['reply_content'],
                        userId: item['user_id'],
                        username: item['user_name'],
                        createTime: item['create_time'],
                        toUsername: item['to_user_name'],
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
    add,
    del,
    reply,
    queryReplyByNoteId
}