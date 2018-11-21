var fs = require("fs");

// 从流中读取数据
var data = '';

// 创建可读流
var readerStream = fs.createReadStream('../../public/file/input.txt');

// 设置编码为 utf8。
readerStream.setEncoding('UTF8');

// 处理流事件 --> data, end, and error
readerStream.on('data', function(chunk) {
  console.log('chunk', chunk)
  data += chunk;
});

readerStream.on('end',function(){
  console.log(data);
});

readerStream.on('error', function(err){
  console.log(err.stack);
});

console.log("程序执行完毕");