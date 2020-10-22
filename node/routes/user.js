var express = require('express');
var router = express.Router();
var db = require('../db_config')

/* GET users listing. */
router.get('/', function (req, res, next) {
  next()
});



module.exports = router;
