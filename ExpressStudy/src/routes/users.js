const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const dbConfig = require('../db/dbConfig');
const db = mysql.createConnection(dbConfig.mysql);
const User = require('../db/userSql');

router.get('/', function(req, res, next) {
  db.query(User.queryAll, function(err,rows){
    if(err){
      res.render("users",{title:"用户列表",datas:[]});
    }else {
      res.render("users",{title:"用户列表",datas:rows});
    }
  })
});

// 渲染一个添加用户页面
router.get('/add', function(req, res, next) {
  res.render('addUser', {title: '添加用户'});
});


// 添加一个用户
router.post('/add', function(req, res, next) {
  console.log(req.body);
  const userName = req.body.userName;
  const password = req.body.password !== undefined ? req.body.password : '123456';
  const sex = req.body.sex !== undefined ? req.body.sex : 0;
  const age = req.body.age !== undefined ? req.body.age : 18;
  const address = req.body.address ? req.body.address : '未知';

  db.query(User.getUserNameInfo,[userName],function (err, results){
    if (err){
      res.send("添加用户失败: " + err);
    }else{
      if (results.length == 0) {
        db.query(User.insert,[userName,password,sex, age, address],function (err, results) {
          if(err){
            console.log(err);
            res.send(err);
          }else{
            console.log(results);
            if(results.insertId > 0){
              res.send('添加用户成功!');
            } else {
              res.send('添加用户失败!');
            }
          }
        });
      } else {
        res.send("该用户名已存在， 请换个用户名!");
      }
    }
  });
});

router.get('/del/:id', function(req, res, next) {
  console.log('req', req.params);
  const id = Number(req.params.id);
  db.query(User.delete, [id], function(err, results) {
    if (err){
      res.send("删除用户失败: " + err);
    } else {
      res.redirect('/');
    }
  });
});

router.post('/delete', function(req, res, next) {
  console.log('req', req.body);
  const id = req.body.id;
  db.query(User.delete, [id], function(err, results) {
    if (err){
      res.send("删除用户失败: " + err);
    } else {
      res.send('删除用户成功！');
    }
  });
});


router.get('/update/:id', function(req, res, next) {
  const id = Number(req.params.id);
  db.query(User.getUserById,[id],function (err, results){
    if (err){
      res.send("根据id查询用户失败: " + err);
    } else {
      const data = results[0];
      console.log(data);
      res.render('updateUser', {title: '修改用户资料信息', data: data});
    }
  });
});

router.post('/update', function(req, res, next) {
  console.log(req.body);
  const id = req.body.id;
  const userName = req.body.userName;
  const password = req.body.password !== undefined ? req.body.password : '123456';
  const sex = req.body.sex !== undefined ? req.body.sex : 0;
  const age = req.body.age !== undefined ? req.body.age : 18;
  const address = req.body.address ? req.body.address : '未知';

  db.query(User.getUserById,[id],function (err, results){
    if (err){
      res.send("根据id查询用户失败: " + err);
    } else {
      if (results.length > 0) {
        db.query(User.update, [userName,password,sex, age, address, id], function(err, results) {
          if (err){
            res.send("更新用户失败: " + err);
          } else {
            // console.log(results);
            res.send('更新用户成功！');
          }
        });
      } else {
        res.send('该用户不存在');
      }
    }
  });
});

router.post('/search', function(req, res, next) {
  const userName = req.body.userName;
  const age = Number(req.body.age);

  console.log(userName+ "---" + age);

  const sql = "select * from user where userName = '" + userName + "' and age < " + age;

  db.query(sql, function(err, results) {
    if(err){
      res.send("查询失败: "+err);
    }else {
      res.render("users",{title:"用户列表",datas:results});
    }
  });
});

module.exports = router;