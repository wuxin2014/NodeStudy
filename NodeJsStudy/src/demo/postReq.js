var http = require('http');
var querystring = require('querystring');

let postHTML = 
  '<html><head><meta charset="utf-8"><title>菜鸟教程 Node.js 实例</title></head>' +
  '<body>' +
  '<form method="POST" action="/">' +
  '<label>用户名：<input name="userName" type="text" /></label><br />' +
  '<label>密码：<input name="pwd" type="text" /></label><br />' +
  '<button type="submit">登录</button>' +
  '</form>' +
  '</body></html>';
 
http.createServer(function(req, res){
  let method = req.method;
  let url = req.url;
  console.log('method:', method);
  console.log('url:', url);

  if(url === '/' && method === 'GET') {
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf8'});
    res.write(postHTML);
    res.end();
  } else if (url === '/' && method === 'POST') {
    // 定义了一个body变量，用于暂存请求体的信息
    var body = "";
    // 通过req的data事件监听函数，每当接受到请求体的数据，就累加到body变量中
    req.on('data', function (chunk) {
      body += chunk;
    });

    // 在end事件触发后，通过querystring.parse将body解析为真正的POST请求格式，然后向客户端返回。
    req.on('end', function () {
      // 解析参数
      body = querystring.parse(body);
      // 设置响应头部信息及编码
      res.writeHead(200, {'Content-Type': 'text/html; charset=utf8'});
  
      res.write("用户名：" + body.userName);
      res.write("<br>");
      res.write("密码：" + body.pwd);
      res.end();
    });
  }
}).listen(3000);

console.log('服务已启动');