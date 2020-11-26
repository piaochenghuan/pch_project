
var query = require('../utils/db')


module.exports = class EventModel {
    constructor() {

    }

    static select(data) {
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

    static insert(data) {

    }
    static update(data) {

    }
    static delete(data) {

    }

}