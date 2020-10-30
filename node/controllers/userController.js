const jwt = require('jsonwebtoken');
const db = require('../utils/db_config')
const path = require('path');
const fs = require('fs');
const func = require('../utils/func')

// 注册
function signUp(req, res, next) {
  let { username, password, confirm, avatarUrl = '' } = req.body
  if (username && password && confirm) {
    // 解密前端的aes
    password = func.RSADecrypt(password)
    // md5加密
    password = func.md5Encrypt(password)

    if (!avatarUrl) {
      avatarUrl = `/upload/default.png`
    }

    const id = (new Date()).valueOf().toString()
    const sql = `INSERT INTO user_table (user_id,user_name,password,user_avatar) VALUES ('${id}','${username}','${password}','${avatarUrl}')`
    db.sqlConnect(sql, [], (err, result) => {
      if (!err) {
        res.json({ success: true, msg: '注册成功' })
      } else {
        res.json({ success: false, msg: err })
      }
    })
  } else {
    res.json({ success: false, msg: '缺参数' })
  }
}

// 用户登录
function login(req, res, next) {
  const { username, password } = req.body
  if (username && password) {
    const sql = `SELECT * FROM user_table WHERE user_name='${username}'`
    db.sqlConnect(sql, [], (err, result) => {
      if (!err) {
        if (result.length > 0 && result[0].password === func.md5Encrypt(func.RSADecrypt(password))) {
          // 生成token
          /*
            sign方法:
            参数1 data 表示要加密的数据
            参数2 str 自定义字符串，这个字符串在解密时需要用到，在这里我随便写了一个‘token’。这相当于一个密钥secret，服务器端需要妥善保管。
            参数3 options 其他内容，可以设置令牌有效时间{expiresIn:time}。time的取值，'15d'表示15天,'2h'表示2小时，……
          */
          const data = {
            userId: result[0].user_id,
            username: result[0].user_name,
            userAvatar: result[0].user_avatar,
          }
          const token = jwt.sign(data, 'userToken', { expiresIn: '1d' })
          data.token = token

          // 保存到数据库
          const sql = `UPDATE user_table SET user_token='${token}' WHERE user_id='${result[0].user_id}'`
          db.sqlConnect(sql, [], (err, result) => {
            if (!err) {
              console.log('token保存成功');
            } else {
              console.log('token保存失败', err);
            }
          })
          res.json({ success: true, msg: '登录成功', data })
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
}

// 上传头像
function uploadAvatar(req, res, next) {
  // 获取文件扩展名
  const newName = req.files[0].path + path.parse(req.files[0].originalname).ext;
  // 文件重命名
  fs.rename(req.files[0].path, newName, err => {
    if (err) {

    } else {
      const url = newName.replace('public', '').replace(/\\/g, "/")
      res.json({ success: true, msg: '上传成功', data: { url } })
    }
  })
}

module.exports = {
  login,
  signUp,
  uploadAvatar
}