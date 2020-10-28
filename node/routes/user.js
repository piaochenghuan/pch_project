var express = require('express');
var router = express.Router();
var db = require('../db_config')
var path = require('path');
var fs = require('fs');

/* GET users listing. */
router.get('/', function (req, res, next) {
  next()
});


router.post('/uploadAvatar', function (req, res, next) {
  const newName = req.files[0].path + path.parse(req.files[0].originalname).ext;
  fs.rename(req.files[0].path, newName, err => {
    if (err) {

    } else {
      const url = newName.replace('public', '').replace(/\\/g, "/")
      res.json({ success: true, msg: '上传成功', data: { url } })
    }
  })
});



module.exports = router;
