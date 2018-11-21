var http = require('http');
var url = require('url');
var util = require('util');
 
http.createServer(function(req, res){
  let method = req.method;
  console.log('method:', method);
  console.log('url:', req.url);
  res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
  res.write(req.url);
  res.write("<br>");
  res.end(util.inspect(url.parse(req.url, true)));
}).listen(3000);

console.log('服务已启动');