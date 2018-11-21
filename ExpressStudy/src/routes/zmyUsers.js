var express = require('express');
var router = express.Router();

const {ZmyUser, Op} = require('../db/dbDevConfig');
const {getWxAccessToken} = require('../utils/WxAccessTokenHelper');


// 查询列表数据
router.get('/', async function(req, res, next) {
  const result = await ZmyUser.findAll({
    attributes: ['id', 'userName', 'password', 'age', 'sex', 'address']
  });
  console.log(result);
  res.render("users", {title:"用户列表",datas: result});
});

// 渲染一个添加用户页面
router.get('/add', function(req, res, next) {
  res.render('addUser', {title: '添加用户'});
});


// 添加一个用户
router.post('/add', async function(req, res, next) {
  console.log('addUser:', req.body);
  const userName = req.body.userName;
  const password = req.body.password !== undefined ? req.body.password : '123456';
  const sex = req.body.sex !== undefined ? req.body.sex : 0;
  const age = req.body.age !== undefined ? req.body.age : 18;
  const address = req.body.address ? req.body.address : '未知';

  if(isNaN(sex)){
    res.send("用户sex不是数字");
    return;
  }

  if(sex != 0 || sex != 1){
    res.send("用户sex只能是数字0,1");
    return;
  }

  if(isNaN(age)){
    res.send("用户age不是数字");
    return;
  }

  try {
    // 判断用户名是否而存在
    const userNameResult = await ZmyUser.findAll({
      where: {
        userName: userName,
      }
    });

    if(userNameResult.length > 0) {
      res.send("该用户名已存在， 请换个用户名!");
      return;
    }

    const insertResult = await ZmyUser.create({
      userName: userName,
      password: password,
      sex: sex,
      age: age,
      address: address
    });
    console.log('insertResult', insertResult);
    res.json(insertResult);
  } catch(err) {
    next(err);
  }
});

router.get('/del/:id', function(req, res, next) {
  console.log('req', req.params);
  const id = Number(req.params.id);

  if(isNaN(id)){
    res.send("用户id不是数字");
    return;
  }

  // 根据id删除user
  ZmyUser
      .destroy({
        'where': {
          'id': id
        }
      })
      .then(function(data) {
        res.send('删除用户成功！');
      })
      .catch(function(err) {
        res.send("删除用户失败: " + err);
      });
});

router.post('/delete', async function(req, res, next) {
  console.log('req', req.body);
  const id = req.body.id;


  if(isNaN(id)){
    res.send("用户id不是数字");
    return;
  }

  // 查询要删除的id是否存在
  const idResult = await ZmyUser.findById(id);
  // id不存在返回null, id存在返回对象
  if(!idResult) {
    res.send("Id不存在, 删除用户失败!");
    return;
  }

  // 根据id删除user
  ZmyUser
      .destroy({
        'where':{'id':id}
      })
      .then(function(data) {
        res.send('删除用户成功！');
      })
      .catch(function(err) {
        res.send("删除用户失败: " + err);
      });
});


router.get('/update/:id', function(req, res, next) {
  const id = Number(req.params.id);

  if(isNaN(id)){
    res.send("用户id不是数字");
    return;
  }

  ZmyUser
      .findById(id)
      .then(function(results) {
        console.log('update', results.dataValues);
        const data = results.dataValues;
        res.render('updateUser', {title: '修改用户资料信息', data: data});
      })
      .catch(function(err) {
        res.send("根据id查询用户失败: " + err);
      });
});

router.post('/update', async function(req, res, next) {
  console.log(req.body);
  const id = Number(req.body.id);
  const userName = req.body.userName;
  const password = req.body.password !== undefined ? req.body.password : '123456';
  const sex = req.body.sex !== undefined ? req.body.sex : 0;
  const age = req.body.age !== undefined ? req.body.age : 18;
  const address = req.body.address ? req.body.address : '未知';

  if(isNaN(id)){
    res.send("用户id不是数字");
    return;
  }

  if(isNaN(sex)){
    res.send("用户sex不是数字");
    return;
  }

  if(sex != 0 || sex != 1){
    res.send("用户sex只能是数字0,1");
    return;
  }

  if(isNaN(age)){
    res.send("用户age不是数字");
    return;
  }

  // 查询要更新的id是否存在
  const result = await ZmyUser.findById(id);
  if(!result){
    res.send('修改的用户不存在');
    return;
  }

  var params = {'userName': userName, 'password': password, 'sex': sex, 'age': age, 'address': address};
  ZmyUser
      .update(params, {
        'where':{
          'id': id
        }
      })
      .then(function(data){
        res.send('更新用户成功！');
      })
      .catch(function(err) {
        res.send("更新用户失败: " + err);
      });
});



router.post('/search', function(req, res, next) {
  const userName = req.body.userName;
  const age = Number(req.body.age);
  if(isNaN(age)){
    res.send("用户age不是数字");
    return;
  }
  console.log(userName+ "---" + age);
  ZmyUser
      .findAll({
        where: {
          'userName': userName,
          'age': {
            [Op.lte]: age
          }
        }
      })
      .then(function(data) {
        res.render("users",{title:"用户列表",datas: data});
      })
      .catch(function(err){
        res.send("查询失败: "+err);
      });
});

router.get('/test', async function(req, res, next) {
  const result = await getWxAccessToken();
  res.send(result);
});

module.exports = router;
