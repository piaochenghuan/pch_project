var express = require('express');
var router = express.Router();


// 1.导入mysql模块
const mysql = require('mysql')
// 2.创建mysql的连接对象
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123123',
  database: 'pch_database'
})


/* GET home page. */
router.get('/', function (req, res, next) {
  next()
});

// 登录
router.post('/login', function (req, res, next) {
  console.log(7777, req.body);
  const { username, password } = req.body
  if (username && password) {
    const sql = 'SELECT * FROM user_table WHERE username=?'
    conn.query(sql, [username], (err, result) => {
      if (!err) {
        if (result.length > 0 && result[0].password === password) {
          res.json({ success: true, msg: '登录成功' })
        } else {
          res.json({ success: false, msg: '账号密码错误' })
        }
      } else {
        res.json({ success: false, msg: err })
      }
    })
  } else {
    res.json({ success: false, msg: '缺参数' })
  }
});

// 注册
router.post('/signup', function (req, res, next) {
  console.log(666, req.body);
  const { username, password, confirm } = req.body
  if (username && password && confirm) {
    const sql = `INSERT INTO user_table (id,username,password) VALUES (?,?,?)`
    conn.query(sql, [username, username, password], (err, result) => {
      if (!err) {
        res.json({ success: true, msg: '注册成功' })
      } else {
        res.json({ success: false, msg: err })
      }
    })
  }

});


module.exports = router;
