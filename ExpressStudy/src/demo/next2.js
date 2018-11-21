var express = require("express");
var app = express();

//  记录请求日志
app.use(function(request, response, next) {
  console.log("In comes a " + request.method + " to " + request.url);
　next();
});

// 对请求做出响应
app.use(function(request, response) {
  response.writeHead(200, { "Content-Type": "text/plain" });
  response.end("Hello, world!");
});

app.listen(3000);

/**
 * 中间件的顺序非常重要。
 * 
 * 这里，我们调用两个函数对http 请求进行处理，一个记录日志，一个负责响应，
 * 这就是Express 的中间件思想，不是把http请求放到一个大的函数中进行处理，而是把请求进行分解，放到一堆函数中进行处理，
 * Express 则按照函数的书写顺序从上到下依次执行。 并且一个函数只做一件事件，这有利于模块化，代码的复用，
 * 更重要的是可以引用第三方模块。那么中间件是什么? 它就是这一堆函数中的每一个函数，就是我们app.use 中的函数
 */