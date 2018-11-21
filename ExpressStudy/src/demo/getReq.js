const Express = require('express');
const app = Express();

app.get('/', function(req, res, next) {
  console.log("req.method:", req.method);
  console.log("req.baseUrl:", req.baseUrl);
  console.log("req.originalUrl:", req.originalUrl);
  console.log("req._parsedUrl:", req._parsedUrl);
  console.log("req.query:", req.query); 
  console.log("req.params:", req.params); 
  res.send('get请求结束');
  // res.end('get请求结束'); 中文会乱码
});

app.get('/user/:id', function (req, res, next) {
  console.log("req.method:", req.method);
  console.log("req.baseUrl:", req.baseUrl);
  console.log("req.originalUrl:", req.originalUrl);
  console.log("req._parsedUrl:", req._parsedUrl);
  console.log("req.query:", req.query); // 获取?后面的参数
  console.log("req.params:", req.params); // 获取路径上的参数{ id: '1' }
  res.send('get请求结束');
});

app.listen(3000, function() {
  console.log("get请求服务已启动");
});