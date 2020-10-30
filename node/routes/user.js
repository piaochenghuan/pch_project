var express = require('express');
var router = express.Router();

var user = require('../controllers/userController')




// 注册
router.post('/signUp',user.signUp)
// 登录
router.post('/login',user.login)
// 上传头像
router.post('/uploadAvatar', user.uploadAvatar);

module.exports = router;
