const Express = require('express');
const app = Express();
const querystring = require('querystring');

app.post('/', function(req, res, next){
  let body = '';
  req.on('data', function(chunk) {
    body += chunk;
  });
  req.on('end', function() {
    console.log(body);
    // 解析参数
    body = querystring.parse(body);  //将一个字符串反序列化为一个对象
    console.log("body:",body);
    // 设置响应头部信息及编码     
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf8'});
    if(body.userName && body.password) { // 输出提交的数据
      res.write("用户名：" + body.userName);
      res.write("<br />");
      res.write("密码：" + body.password);
    } else {  // 输出表单
        res.write(postHTML);
    }
    res.end();
  });
  // res.end();
});

app.listen(3000, function() {
  console.log('postdemo请求服务已启动');
});