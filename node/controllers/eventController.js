var query = require('../utils/db_config')
var moment = require('moment');
const path = require('path');
const fs = require('fs');


function queryEvent(req, res, next) {

    const { keyword = '', userId = '', page = 1, pageSize = 5 } = req.query
    const index = Number(page) * Number(pageSize) - Number(pageSize)
    const sql = `
        SELECT
        e.event_id,
        e.event_name,
        e.event_location,
        e.event_content,
        e.event_Initiator,
        e.event_time,
        e.event_participants,
        e.event_images,
        e.event_call_others,
        e.event_create_time,
        u.user_name,
        u.user_avatar
        FROM
        event_table AS e
        left join user_table as u on e.event_Initiator = u.user_id
        where
        e.event_name like '%${keyword}%'  
        and
        e.event_Initiator like '%${userId}%'
        limit ${index},${Number(pageSize)};
    `
    // 总条数
    const sql2 = `
        SELECT 
        COUNT(*) 
        FROM 
        event_table 
        WHERE 
        event_name LIKE '%${keyword}%';
    `
    query(sql + sql2)
        .then(result => {
            const list = result[0].map(item => {
                return {
                    eventId: item['event_id'],
                    name: item['event_name'],
                    location: item['event_location'],
                    content: item['event_content'],
                    eventTime: item['event_time'],
                    createTime: item['event_create_time'],
                    images: item['event_images'],
                    initiatorId: item['event_Initiator'],
                    initiatorName: item['user_name'],
                    initiatorAvatar: item['user_avatar'],
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

function add(req, res, next) {
    const { name, location, eventTime, content = '', callOthers } = req.body, { userId } = req.userInfo
    if (name && location && eventTime) {
        let images = []
        // 如果有图片
        if (req.files && req.files.length > 0) {

        }
        images = images.join(',')
        const id = (new Date()).valueOf().toString()
        const time = moment().format('YYYY-MM-DD hh:mm')
        const sql = `
            INSERT INTO 
            event_table 
            (event_id,event_initiator,event_name,event_location,event_content,event_time,event_create_time,event_images) 
            VALUES 
            ('${id}','${userId}','${name}','${location}','${content}','${eventTime}','${time}','${images}')
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


function join(req, res, next) {
    const { eventId, join } = req.body, { userId } = req.userInfo
    if (eventId && join) {
        let sql = ``
        if (join === '1') { // 参加
            const id = (new Date()).valueOf().toString()
            const time = moment().format('YYYY-MM-DD hh:mm')
            sql = `
            INSERT INTO 
            join_table 
            (join_id,event_id,user_id,create_time) 
            VALUES 
            ('${id}','${eventId}','${userId}','${time}')
        `
        } else { // 取消参加
            sql = `
                DELETE FROM 
                join_table 
                WHERE 
                user_id='${userId}'
            `
        }
        query(sql)
            .then(result => {
                res.json({ success: true, msg: '成功' })
            })
            .catch(err => res.json({ success: false, msg: err }))
    } else {
        res.json({ success: false, msg: '缺少参数' })
    }
}



function queryJoinList(req, res, next) {
    const { eventId } = req.query
    const sql = `
        SELECT
        j.join_id,
        j.create_time,
        j.user_id,
        u.user_name,
        u.user_avatar
        FROM
        join_table AS j
        left join user_table as u on   j.user_id = u.user_id
        where
        j.event_id = '${eventId}'
    `

    query(sql)
        .then(result => {
            const list = result.map(item => {
                return {
                    eventId,
                    joinId: item['join_id'],
                    createTime: item['create_time'],
                    userId: item['user_id'],
                    username: item['user_name'],
                    userAvatar: item['user_avatar']
                }
            });
            res.json({
                success: true,
                data: list
            })
        })
        .catch(err => res.json({ success: false, msg: err }))

}

// 删除
function del(req, res, next) {
    const { eventId } = req.body
    if (eventId) {
        const sql = `
            DELETE FROM 
            event_table 
            WHERE 
            event_id='${eventId}'
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




module.exports = {
    queryEvent,
    add,
    join,
    queryJoinList,
    del
}