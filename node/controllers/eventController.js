const EventModel = require('../models/eventModel');
const UserModel = require('../models/userModel');
const app = require('../app');

// 查询活动列表
function queryEvent(req, res, next) {
    EventModel.queryEvent(req.query)
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

// 新建活动
function add(req, res, next) {
    const { name, location, eventTime, callOthers } = req.body, { userId } = req.userInfo
    if (name && location && eventTime) {
        // 如果有邀请其他人
        if (callOthers) {
            callOthers.forEach(async (userId) => {
                // 记录消息数
                await UserModel.updateUser({ userId, field: 'userRemindCount', action: '++' })
                // socket主动推送消息
                global.io.to(global.socketUsers[userId]).emit('remindPush', '')

            })
        }

        EventModel.addEvent({ ...req.body, userId })
            .then(result => res.json({ success: true, msg: '成功' }))
            .catch(err => res.json({ success: false, msg: err }))
    } else {
        res.json({ success: false, msg: '缺少参数' })
    }
}

// 参加或取消活动
function join(req, res, next) {
    const { eventId, join } = req.body, { userId } = req.userInfo
    if (eventId && join) {
        EventModel.join({ ...req.body, userId })
            .then(result => res.json({ success: true, msg: '成功' }))
            .catch(err => res.json({ success: false, msg: err }))
    } else {
        res.json({ success: false, msg: '缺少参数' })
    }
}


// 查询已参加的人员
function queryJoinList(req, res, next) {
    const { eventId } = req.query
    if (eventId) {
        EventModel.selectJoinList(req.query)
            .then(list => res.json({ success: true, data: list }))
            .catch(err => res.json({ success: false, msg: err }))
    }
}

// 删除活动
function del(req, res, next) {
    const { eventId } = req.body
    if (eventId) {
        EventModel.deleteEvent(req.body)
            .then(result => res.json({ success: true, msg: '成功' }))
            .catch(err => res.json({ success: false, msg: err }))
    } else {
        res.json({ success: false, msg: '缺少参数' })
    }
}


// 查询被邀请过的活动列表
async function queryRemindedEvent(req, res, next) {
    const { userId } = req.userInfo
    if (userId) {
        await EventModel.queryRemindedEvent({ userId })
            .then(list => res.json({ success: true, data: list, msg: '成功' }))
            .catch(err => res.json({ success: false, msg: err }))
        // 清空消息提醒数量
        await UserModel.updateUser({ userId, field: 'userRemindCount', value: 0 })
        //  告诉客户端待看的消息已经被查看 
        global.io.to(global.socketUsers[userId]).emit('remindPush', '')
    } else {
        res.json({ success: false, msg: '缺少参数' })
    }
}



module.exports = {
    queryEvent,
    add,
    join,
    queryJoinList,
    del,
    queryRemindedEvent
}