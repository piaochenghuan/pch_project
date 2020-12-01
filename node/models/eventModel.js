
const query = require('../utils/db')
const moment = require('moment');



module.exports = class EventModel {
    constructor() {

    }

    static queryEvent(data) {
        const { keyword = '', userId = '', page = 1, pageSize = 5 } = data
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
        or
        e.event_id = '${keyword}'
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
        return query(sql + sql2)
            .then(result => {
                return {
                    list: result[0].map(item => ({
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
                    })),
                    page: Number(page),
                    pageSize: Number(pageSize),
                    total: result[1][0]['COUNT(*)']
                }
            })
            .catch(err => err)
    }

    static addEvent(data) {
        const { name, location, eventTime, content = '', callOthers = '', images = '', userId } = data
        const id = (new Date()).valueOf().toString()
        const time = moment().format('YYYY-MM-DD hh:mm')
        const sql = `
            INSERT INTO 
            event_table 
            (event_id,event_initiator,event_name,event_location,event_content,event_time,event_create_time,event_images,event_call_others) 
            VALUES 
            ('${id}','${userId}','${name}','${location}','${content}','${eventTime}','${time}','${images}','${callOthers}')
        `
        return query(sql)
            .then(result => result)
            .catch(err => err)
    }
    static update(data) {

    }
    static deleteEvent(data) {
        const { eventId } = data
        const sql = `
        DELETE FROM 
        event_table 
        WHERE 
        event_id='${eventId}'
    `
        return query(sql)
            .then(result => result)
            .catch(err => err)
    }

    static selectJoinList(data) {
        const { eventId } = data
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
        return query(sql)
            .then(result => {
                return result.map(item => ({
                    eventId,
                    joinId: item['join_id'],
                    createTime: item['create_time'],
                    userId: item['user_id'],
                    username: item['user_name'],
                    userAvatar: item['user_avatar']
                }))
            })
            .catch(err => err)
    }

    static join(data) {
        const { eventId, join, userId } = data
        const id = (new Date()).valueOf().toString()
        const time = moment().format('YYYY-MM-DD hh:mm')
        let sql = ``
        if (join === '1') {
            sql = `
                INSERT INTO 
                join_table 
                (join_id,event_id,user_id,create_time) 
                VALUES 
                ('${id}','${eventId}','${userId}','${time}')
            `
        } else {
            sql = `
                DELETE FROM 
                join_table 
                WHERE 
                user_id='${userId}'
            `
        }
        return query(sql)
            .then(result => result)
            .catch(err => err)
    }

    static queryRemindedEvent(data) {
        const { userId } = data
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
            e.event_call_others like '%${userId}%'
        `
        return query(sql)
            .then(result => {
                return result.map(item => ({
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
                }))

            })
    }
}