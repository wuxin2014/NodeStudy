const Express = require('express');
const app = Express();
const querystring = require('querystring');

var postHTML =
  '<html><head><meta charset="utf-8"><title>菜鸟教程 Node.js 实例</title></head>' +
  '<body>' +
  '<form method="post">' +
  '网站名： <input name="name"><br>' +
  '网站 URL： <input name="url"><br>' +
  '<input type="submit">' +
  '</form>' +
  '</body></html>';

app.all("/", function(req, res, next){
  console.log(req);
  console.log(req.method);
  if(req.method === 'GET') {
    console.log(req.baseUrl);
    console.log(req.originalUrl);
    console.log(req._parsedUrl);
    console.log(req.query);
    console.log(req.params);
    console.log(req.path);
    res.send("get请求传递的参数是：" + req.query.userName);
  } else {
    console.log(req.body); // undefined
    console.log(req.params); // {}
    // 暂存请求体信息
    var body = "";
    req.on("data", function(chunk) {
      body += chunk;  //一定要使用+=，如果body=chunk，因为请求favicon.ico，body会等于{}
      console.log("chunk:",chunk);
    });
    req.on("end", function() {
      // 解析参数
      body = querystring.parse(body);  //将一个字符串反序列化为一个对象
      console.log("body:",body);
      // 设置响应头部信息及编码     
      res.writeHead(200, {'Content-Type': 'text/html; charset=utf8'});
      if(body.userName && body.password) { // 输出提交的数据
        res.write("用户名：" + body.userName);
        res.write("<br>");
        res.write("密码：" + body.password);
      } else {  // 输出表单
          res.write(postHTML);
      }
      res.end();
    });
  }
});

app.listen(3000, function() {
  console.log('服务已启动');
});