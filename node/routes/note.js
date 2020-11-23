var express = require('express');
var router = express.Router();
var note = require('../controllers/noteController')


router.get('/', function (req, res, next) {
    next()
})


// 查询
router.get('/query', note.queryNote);
// 新增
router.post('/add', note.add);
// 删除
router.post('/delete', note.del);

// 查询回复列表
router.get('/queryReplyByNoteId', note.queryReplyByNoteId);
// 回复
router.post('/reply', note.reply);

module.exports = router;