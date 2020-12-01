var express = require('express');
var router = express.Router();
var event = require('../controllers/eventController')


router.get('/', function (req, res, next) {
    next()
})


// 查询
router.get('/query', event.queryEvent);

// 新增
router.post('/add', event.add);
// 参加
router.post('/join', event.join);
// 参加人员
router.get('/queryJoinList', event.queryJoinList);
// 删除活动
router.post('/delete', event.del);
//  被邀请的活动列表查询
router.get('/queryRemindedEvent', event.queryRemindedEvent);

module.exports = router;