const express = require('express');
const router = express.Router();
const select = require('../utils/sqlUtil');

router.get('/', function(req, res, next) {
  res.render('login', {title: '登录界面'});
});

router.post('/', function(req, res, next) {
  console.log(req.body);
  const {userName, password} = req.body;
  const sqlString = "select * from users where userName = ? and password = ?";
  const values = [userName, password];
  select(sqlString, values).then(results=> {
    console.log('results', results);
    if (results.length > 0) {
      // res.json({status: 200, msg: '登录成功', data: results[0]}); 
      res.redirect('/users');
    } else {
      res.send({status: 99, msg: '用户名或者密码错误！'});
    }
  }).catch(error => {
    res.send({status: 100, msg: '数据库操作有误！'});
  });
});

module.exports = router;