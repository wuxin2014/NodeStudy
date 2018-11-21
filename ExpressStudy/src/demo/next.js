const express = require('express');
const app = express();

/**
 * 一个 Express 应用就是在调用各种中间件，中间件(Middleware)是一个函数，它可以访问请求对象(request object (req)), 
 * 响应对象(response object (res)), 和web应用中处于请求-响应循环流程中的中间件，一般被命名为next的变量。
 * 
 * 中间件的功能包括：
 * 1、执行任何代码。
 * 2、修改请求和响应对象。
 * 3、终结请求-响应循环。
 * 4、调用堆栈中的下一个中间件。
 * 
 */

/**
 * 案例一：
 * 调用next()进入下一个中间件的两种情况
 * 1、执行next()，如果后面还有中间件，那么就会调用下一个中间件
 * 2、执行next()，后面没有中间件了，那么就会终结请求-响应
 */
app.get('/', function(req, res, next) {
  // 修改响应对象
  res.body = 'a';
  //res.send("next的使用");
  // 执行下一个中间件
  next();
}, function(req, res, next) {
  console.log('进入下一个中间件', res.body);
  // 终结请求-响应
  next();
  // res.send();
});


/**
 * 案例二：
 * 如果调用了res.send(), 还是可以调用next
 */
app.get('/login', function(req, res, next){
  // 结束请求响应
  res.send('User Info');
  // next();
}, function(req, res, next){
  console.log('进入下一个中间件', res.req);
  next();
});


app.listen(3000, function() {
  console.log('服务已启动');
});