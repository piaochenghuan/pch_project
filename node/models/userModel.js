const query = require('../utils/db')


class UserModel {
    constructor() {

    }
    static queryUser(data) {
        const { username } = data
        const sql = `
        select
        *
        from
        user_table 
        where
        user_name = '${username}'
     `
        return query(sql)
            .then(result => {
                if (result[0]) {
                    return {
                        userId: result[0]['user_id'],
                        username: result[0]['user_name'],
                        password: result[0]['user_password'],
                        userAvatar: result[0]['user_avatar'],
                    }
                }
            })
            .catch(err => err)
    }
    static addUser(data) {
        const { username, password, avatarUrl = '/upload/default.png' } = data
        const id = (new Date()).valueOf().toString()
        const sql = `
            INSERT INTO
            user_table 
            (user_id,user_name,password,user_avatar) 
            VALUES 
            ('${id}','${username}','${password}','${avatarUrl}')
         `
        return query(sql)
            .then(result => result)
            .catch(err => err)
    }
    static updateUser(data) {
        const map = {
            username: 'user_name',
            userAvatar: 'user_avatar',
        }
        const { field, value, userId } = data
        const sql = `update user_table set ${map[field]} = '${value}' where user_id = '${userId}'`
        return query(sql)
            .then(result => result)
            .catch(err => err)
    }

    static queryAllByUsername(data) {
        const { keyword = '' } = data
        const sql = `
        select
        *
        from
        user_table 
        where
        user_name like '%${keyword}%' 
     `
        return query(sql)
            .then(result => {
                return result.map(item=>{
                    return {
                        userId: item['user_id'],
                        username: item['user_name'],
                        password: item['user_password'],
                        userAvatar: item['user_avatar'],
                    }
                })
                    
                
            })
            .catch(err => err)

    }
}

module.exports = UserModel