var createError = require('http-errors');
var express = require('express');
var path = require('path');
var fs = require('fs');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// jwt模块(token)
var jwt = require('jsonwebtoken');
// 引入文件上传模块
const multer = require('multer');

var app = express();


// 接受上传文件模块中间件
app.use(multer({ dest: './public/upload' }).any());


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));




// 路由拦截
app.all('*', function (req, res, next) {
  // 设置请求头为允许跨域
  res.header('Access-Control-Allow-Origin', '*');
  // 设置服务器支持的所有头信息字段
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild, sessionToken');
  // 设置服务器支持的所有跨域请求的方法
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

  if (req.method.toLowerCase() == 'options') { // 让options尝试请求快速结束
    res.sendStatus(200);
  } else {
    if (req.path !== '/user/login' && req.path !== '/user/signUp' && req.path !== '/user/uploadAvatar') {
      const token = req.headers.authorization
      if (!token) { // token 不存在时
        res.status(500)
        res.json({ success: false, msg: 'token缺失!!' })
      } else {
        try {
          const tokenOK = jwt.verify(token, 'userToken')
          if (tokenOK) {
            req.userInfo = tokenOK
            next()
          }
        } catch (err) {
          res.json({ success: false, msg: '非法token!!' })
        }
      }
    } else {
      next();
    }
  }

});

// 路由
app.use('/', require('./routes/index'));
app.use('/user', require('./routes/user'));
app.use('/note', require('./routes/note'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});




// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
