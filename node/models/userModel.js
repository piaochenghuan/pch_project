const query = require('../utils/db')


class UserModel {
    constructor() {

    }

    static addUser(data) {
        const { username, password, avatarUrl = '/upload/default.png' } = data
        const id = (new Date()).valueOf().toString()
        const sql = `
            INSERT INTO
            user_table 
            (user_id,user_name,user_password,user_avatar,user_remind_count) 
            VALUES 
            ('${id}','${username}','${password}','${avatarUrl}',0)
         `
        return query(sql)
            .then(result => result)
            .catch(err => err)
    }
    static updateUser(data) {
        const map = {
            username: 'user_name',
            userAvatar: 'user_avatar',
            userRemindCount: 'user_remind_count'
        }
        const { field, value, userId, action } = data

        let sql = ``
        if (action === '++') {
            sql = `update user_table set ${map[field]} = ${map[field]} + 1 where user_id = '${userId}'`
        } else {
            sql = `update user_table set ${map[field]} = '${value}' where user_id = '${userId}'`
        }


        return query(sql)
            .then(result => result)
            .catch(err => err)
    }

    static queryUser(data) {
        const { keyword = '' } = data
        const sql = `
        select
        *
        from
        user_table 
        where
        user_name like '%${keyword}%'
        or
        user_id = '${keyword}'
     `
        return query(sql)
            .then(result => {
                return result.map(item => {
                    return {
                        userId: item['user_id'],
                        password: item['user_password'],
                        username: item['user_name'],
                        userAvatar: item['user_avatar'],
                        userRemindCount: item['user_remind_count'],
                    }
                })


            })
            .catch(err => err)

    }
}

module.exports = UserModel