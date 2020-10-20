var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  next()
});

router.post('/login', function (req, res, next) {
  console.log(7777, req.body);
  const { username, password } = req.body
  if (username === 'admin' && password === '123') {
    res.json({ success: true, msg: '登陆成功' })
  } else {
    res.json({ success: false, msg: '账号密码错误' })
  }
});


module.exports = router;
