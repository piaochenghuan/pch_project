var express = require('express');
var router = express.Router();
var db = require('../db_config')
var jwt = require('jsonwebtoken');
var crypto = require('crypto')
const NodeRSA = require('node-rsa');


//生成 公钥私钥
const key = new NodeRSA({ b: 512 }); //生成位的密钥
var publicDer = key.exportKey('pkcs1-public-pem'); //公钥
var privateDer = key.exportKey('pkcs1-private-pem');//私钥

// rsa解密
function RSADecrypt(data) {
  const key = new NodeRSA(`-----BEGIN RSA PRIVATE KEY-----
  MIIBPAIBAAJBAPFJJ4ZG2IFZJOD05HlzNuB50ISHvnvEZVpWwRLYmOge50On5c+3
  UOYAhxHMfDzhGp5odiKZVI7eacQXdtbeQlkCAwEAAQJBAJ5w1jZzcRpHClN6HEmw
  IXn4I7fTV374cUGINFKGzqmk0uQEXyzkaqgHvFrpIQCmjVjdbMkE67sD0Ly0j66a
  nf0CIQD+UNZCyE789EOy5w0wQGlM6wV6X8EAmVgwqinMjZWVRwIhAPLiOf+tctX9
  rh8WGkISNP0DhzZ4u4tAi560/vShp7tfAiEAuaSIw3c1MbGdOZswJWjfdSaaeRos
  6SMHHX8ZxBgWeUECIAM4drZqMVyfCYEGBQEdRrCYLGHPhgUZrQBEvCC4SAYXAiEA
  kixih/hHzhPVCOQAhzlqXxOOFbHvTMhZvhnE0jS4VFc=
  -----END RSA PRIVATE KEY-----`)
  const decrypted = key.decrypt(data, 'utf8')
  console.log('解密后的密码是', decrypted);
  return decrypted
}


// 解密AES
// function aesDecrypt(encrypted) {
//   const key = '1111111111111111'
//   const iv = '2222222222222222'
//   const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
//   let decrypted = decipher.update(encrypted, 'hex', 'utf8');
//   decrypted += decipher.final('utf8');
//   return decrypted;
// }
// md5加密
function md5Encrypt(data) {
  return crypto.createHash('md5').update(data).digest("hex")
}


/* GET home page. */
router.get('/', function (req, res, next) {
  next()
});

// 注册
router.post('/signUp', function (req, res, next) {
  let { username, password, confirm, avatarUrl = '' } = req.body
  if (username && password && confirm) {
    // 解密前端的aes
    password = RSADecrypt(password)
    // md5加密
    password = md5Encrypt(password)

    const id = (new Date()).valueOf().toString()
    const sql = `INSERT INTO user_table (user_id,user_name,password,user_avatar) VALUES ('${id}','${username}','${password}','${avatarUrl}')`
    db.query(sql, (err, result) => {
      if (!err) {
        res.json({ success: true, msg: '注册成功' })
      } else {
        res.json({ success: false, msg: err })
      }
    })
  } else {
    res.json({ success: false, msg: '缺参数' })
  }
});



// 登录
router.post('/login', function (req, res, next) {
  const { username, password } = req.body
  if (username && password) {
    const sql = `SELECT * FROM user_table WHERE user_name='${username}'`
    db.query(sql, (err, result) => {
      if (!err) {

        const psw = md5Encrypt(RSADecrypt(password))
        if (result.length > 0 && result[0].password === psw) {
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
          db.query(sql, (err, result) => {
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
});

module.exports = router;
