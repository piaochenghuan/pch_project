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

// 根据用户名搜索
router.get('/queryAllByUsername', user.queryAllByUsername);

module.exports = router;
