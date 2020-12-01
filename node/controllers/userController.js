const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const func = require('../utils/func')
const UserModel = require('../models/userModel')

// 注册
async function signUp(req, res, next) {
  const { username, password, confirm } = req.body
  if (username && password && confirm) {
    // 是否存在用户
    const result = await UserModel.queryUser({ keyword: username })
    const user = result[0]
    if (user) {
      return res.json({ success: false, msg: '用户已存在' })
    }
    // 加密  解密前端的aes + md5加密
    const encryptedPwd = func.md5Encrypt(func.RSADecrypt(password))
    // 插入数据库
    UserModel.addUser({ ...req.body, password: encryptedPwd })
      .then(result => {
        res.json({ success: true, msg: '注册成功' })
      })
      .catch(err => {
        res.json({ success: false, msg: err })
      })
  } else {
    res.json({ success: false, msg: '缺参数' })
  }
}

// 用户登录
async function login(req, res, next) {
  const { username, password } = req.body
  if (username && password) {
    // 是否存在用户
    const result = await UserModel.queryUser({ keyword: username })
    const user = result[0]
    if (!user) {
      return res.json({ success: false, msg: '用户不存在' })
    }
    
    // 验证密码
    if (user.password === func.md5Encrypt(func.RSADecrypt(password))) {
      /*
        生成token
        sign方法:
        参数1 data 表示要加密的数据
        参数2 str 自定义字符串，这个字符串在解密时需要用到，在这里我随便写了一个‘token’。这相当于一个密钥secret，服务器端需要妥善保管。
        参数3 options 其他内容，可以设置令牌有效时间{expiresIn:time}。time的取值，'15d'表示15天,'2h'表示2小时，……
      */
      const data = {
        userId: user.userId,
        username: user.username,
        userAvatar: user.userAvatar,
      }
      const token = jwt.sign(data, 'userToken', { expiresIn: '1d' })

      res.json({ success: true, msg: '登录成功', data: { ...data, token } })
    } else {
      res.json({ success: false, msg: '账号密码错误' })
    }
  } else {
    res.json({ success: false, msg: '缺参数' })
  }
}

// 上传头像
function uploadAvatar(req, res, next) {
  const { userId } = req.userInfo
  // 获取文件扩展名
  const newName = req.files[0].path + path.parse(req.files[0].originalname).ext;
  // 文件重命名
  fs.rename(req.files[0].path, newName, err => {
    if (!err) {
      const dir = newName.replace('public', '').replace(/\\/g, "/")
      UserModel.updateUser({ field: 'userAvatar', value: dir, userId })
        .then(result => {

          res.json({ success: true, data: { userAvatar: dir } })
        })
        .catch(err => {

          res.json({ success: false, msg: err })
        })
    }
  })
}


function queryUser(req, res, next) {
  UserModel.queryUser(req.query)
    .then(result => res.json({ success: true, data: result }))
    .catch(err => res.json({ success: false, msg: err }))
}

module.exports = {
  login,
  signUp,
  uploadAvatar,
  queryUser
}