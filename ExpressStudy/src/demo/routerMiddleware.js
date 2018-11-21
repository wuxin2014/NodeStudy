const express = require('express');
const app = express();
const router = express.Router();
// 路由中间件的案例

// 没有挂载路径的中间件，通过该路由的每个请求都会执行该中间件
router.use(function (req, res, next) {
  console.log('Time:', Date.now());
  next();
});

// 一个中间件栈，显示任何指向 /login的HTTP请求的信息
router.use('/login', function(req, res, next) {
  console.log('Request URL:', req.originalUrl);
  next();
}, function (req, res, next) {
  console.log('Request Type:', req.method);
  next();
});

// 一个中间件栈，处理指向 /user/:id 的 GET 请求
router.get('/user/:id', function (req, res, next) {
  console.log('Request URL:', req.originalUrl);
  if (req.params.id == 0) {
    // 如果 user id 为 0, 跳到下一个路由
    next('route');
  } else {
    // 负责将控制权交给栈中下一个中间件
    next();
  }
}, function (req, res, next) {
  // 渲染常规页面
  // res.render('regular');
  // 终止请求
  next();
});

// 注意：将路由挂载至应用
app.use('/', router);
app.listen(3000, function() {
  console.log('routerMiddleware服务已启动');
});