var express = require('express');
var router = express.Router();

var user = require('../controllers/userController')

router.get('/', function (req, res, next) {
    next()
})


// 注册
router.post('/signUp', user.signUp)
// 登录
router.post('/login', user.login)
// 上传头像
router.post('/uploadAvatar', user.uploadAvatar);

// 用户搜索
router.get('/queryUser', user.queryUser);

module.exports = router;
