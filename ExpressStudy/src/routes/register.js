const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const dbConfig = require('../db/dbConfig');
const db = mysql.createConnection(dbConfig.mysql);
const User = require('../db/usersql');

router.get('/', function(req, res, next) {
  res.render('register', { title: '注册界面' });
});

router.post('/', function(req, res, next) {
  console.log(req.body);
  const userName = req.body.userName;
  const password = req.body.password !== undefined ? req.body.password : '123456';
  const sex = req.body.sex !== undefined ? req.body.sex : 0;
  const age = req.body.age !== undefined ? req.body.age : 18;
  const address = req.body.address ? req.body.address : '未知';
  
  if(userName.length > 0 && password.length > 0) {
    db.query(User.getUserByInfo,[userName,password],function (err, results){
      if (err){
        res.send("注册失败：" + err);
      }else{
        if (results.length == 0) {
          db.query(User.insert,[userName,password,sex, age, address],function (err, results) {
            if (err) {
              res.send("注册失败!" + err);
            } else {
              console.log("insert result:", results.insertId);
              res.redirect("/login");
              // res.end(JSON.stringify({status:'100',msg:'注册成功!'})); 疑问字符串乱码
            }
          })
        } else {
          res.send("该用户名已经被注册!");
        }
      }
    });
  } else {
    res.send("用户名跟密码不能为空！");
  }
});

module.exports = router;