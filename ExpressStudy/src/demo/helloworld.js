const Express  = require('express');
const app = Express();

app.get('/', function (req, res) {
  // 结束请求响应
  res.send('Hello World!');
});

app.listen(3000, () => {
  console.log('服务已启动');
});