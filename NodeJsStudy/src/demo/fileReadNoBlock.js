var fs = require("fs");

// 非阻塞代码实例
// fs.readFile() 是异步函数用于读取文件
fs.readFile('../../public/file/input.txt', function (err, data) {
  if (err) return console.error(err);
  console.log(data.toString());
});
console.log("程序执行结束!");