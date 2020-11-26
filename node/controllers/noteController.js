var query = require('../utils/db')
var moment = require('moment');
const path = require('path');
const fs = require('fs');
const NoteModel = require('../models/noteModel');

// 查询
function queryNote(req, res, next) {
    NoteModel.queryNote(req.query)
        .then(result => {
            const { list, page, pageSize, total } = result
            res.json({
                success: true,
                data: {
                    list,
                    page,
                    pageSize,
                    total
                }
            })
        })
        .catch(err => res.json({ success: false, msg: err }))
}


// 新增
function add(req, res, next) {
    const { title, content } = req.body, { userId } = req.userInfo
    if (title && content) {
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
        NoteModel.addNote({ ...req.body, images, userId })
            .then(result => res.json({ success: true, msg: '成功' }))
            .catch(err => res.json({ success: false, msg: err }))
    } else {
        res.json({ success: false, msg: '缺少参数' })
    }
}
// 删除
function del(req, res, next) {
    const { noteId } = req.body
    if (noteId) {
        NoteModel.deleteNote(req.body)
            .then(result => res.json({ success: true, msg: '成功' }))
            .catch(err => res.json({ success: false, msg: err }))
    } else {
        res.json({ success: false, msg: '缺少参数' })
    }
}

// 评论回复
async function reply(req, res, next) {
    const { content, noteId, replyId } = req.body, { userId } = req.userInfo
    if (noteId && content) {

        let toUserId = ''
        // 如果是回复对方评论

        if (replyId) {
            // 查询被评论的 评论信息
            const result = await NoteModel.queryByReplyId({ replyId })

            result && (toUserId = result.userId)
        }

        NoteModel.reply({ ...req.body, userId, toUserId })
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
        NoteModel.queryReplyListByNoteId(req.query)
            .then(list => res.json({ success: true, data: list }))
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