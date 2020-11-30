const query = require('../utils/db')
const moment = require('moment');

module.exports = class NoteModel {
    constructor() {

    }

    static queryNote(data) {
        const { keyword = '', userId = '', page = 1, pageSize = 5 } = data
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
        return query(sql + sql2)
            .then(result => {
                return {
                    list: result[0].map(item => ({
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
                    })),
                    page: Number(page),
                    pageSize: Number(pageSize),
                    total: result[1][0]['COUNT(*)']
                }
            })
            .catch(err => err)
    }
    static addNote(data) {
        const { title, content, desc = '', userId, images } = data
        const id = (new Date()).valueOf().toString()
        const time = moment().format('YYYY-MM-DD hh:mm')
        const sql = `
            INSERT INTO 
            note_table 
            (note_id,user_id,note_title,note_content,create_time,note_desc,note_images,reply_count)
            VALUES 
            ('${id}','${userId}','${title}','${content}','${time}','${desc}','${images}',${0})
        `
        return query(sql)
            .then(result => result)
            .catch(err => err)
    }
    static deleteNote(data) {
        const { noteId } = data
        const sql = `
            DELETE FROM 
            note_table 
            WHERE 
            note_id='${noteId}'
        `
        return query(sql)
            .then(result => result)
            .catch(err => err)
    }
    static reply(data) {
        const { content, noteId, userId, toUserId = '' } = data
        const id = (new Date()).valueOf().toString()
        const time = moment().format('YYYY-MM-DD hh:mm')
        const sql = `
            INSERT INTO 
            reply_table 
            (reply_id,note_id,reply_content,create_time,user_id,to_user_id) 
            VALUES 
            ('${id}','${noteId}','${content}','${time}','${userId}','${toUserId}');
        `
        const sql2 = `
            update 
            note_table 
            set 
            reply_count = reply_count+1 
            WHERE 
            note_id='${noteId}'
        `

        return query(sql + sql2)
            .then(result => result)
            .catch(err => err)

    }
    static queryReplyListByNoteId(data) {
        const { noteId } = data
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
        return query(sql)
            .then(result => {
                return result.map(item => ({
                    replyId: item['reply_id'],
                    noteId: item['note_id'],
                    content: item['reply_content'],
                    userId: item['user_id'],
                    username: item['user_name'],
                    createTime: item['create_time'],
                    toUsername: item['to_user_name'],
                    toUserId: item['to_user_id'],
                    userAvatar: item['user_avatar'],
                }))

            })
            .catch(err => err)

    }

    static queryByReplyId(data) {
        const { replyId } = data
        const sql = `
            select 
            * 
            from 
            reply_table 
            where 
            reply_id= '${replyId}'
        `
        return query(sql)
            .then(result => {
                
                return {
                    userId: result[0]['user_id']
                }
            })
            .catch(err => err)
    }
}