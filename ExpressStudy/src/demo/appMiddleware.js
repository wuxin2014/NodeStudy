const express = require('express');
const app = express();
// 应用中间件的案例

// 没有挂载路径的中间件，应用的每个请求都会执行该中间件
app.use(function (req, res, next) {
  console.log('Time:', Date.now());
  // 终结请求响应
  next();
});

// 挂载至/login的中间件，任何指向/login的请求都会执行它
app.use('/login', function (req, res, next) {
  console.log('Request Type:', req.method);
  next();
});

// 路由和句柄函数(中间件系统)，处理指向 /user/:id 的 GET 请求
app.get('/user/:id', function (req, res, next) {
  res.send('USER');
});

// 一个中间件栈，对任何指向 /news/:id 的 HTTP 请求打印出相关信息
app.use('/news/:id', function(req, res, next) {
  console.log('Request URL:', req.originalUrl);
  next();
}, function (req, res, next) {
  console.log('Request Type:', req.method);
  next();
});

// 处理 /article/:id， 打印出用户 id
app.get('/article/:id', function (req, res, next) {
  // 结束请求响应
  res.end(req.params.id);
});

app.listen(3000, function() {
  console.log('服务已启动');
});
