var query = require('../utils/db')
var moment = require('moment');
const EventModel = require('../models/eventModel');
const UserModel = require('../models/userModel')


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

function add(req, res, next) {
    const { name, location, eventTime, callOthers } = req.body, { userId } = req.userInfo
    if (name && location && eventTime) {

        if (callOthers) {
            callOthers.forEach(async (userId) => {
                await UserModel.updateUser({ userId, field: 'userRemindCount', action: '++' })
                console.log(111);
            })
        }

        EventModel.addEvent({ ...req.body, userId })
            .then(result => res.json({ success: true, msg: '成功' }))
            .catch(err => res.json({ success: false, msg: err }))


    } else {
        res.json({ success: false, msg: '缺少参数' })
    }
}


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



function queryJoinList(req, res, next) {
    const { eventId } = req.query
    if (eventId) {
        EventModel.selectJoinList(req.query)
            .then(list => res.json({ success: true, data: list }))
            .catch(err => res.json({ success: false, msg: err }))
    }
}

// 删除
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




module.exports = {
    queryEvent,
    add,
    join,
    queryJoinList,
    del
}