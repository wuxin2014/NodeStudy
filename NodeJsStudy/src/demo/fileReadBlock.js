var fs = require("fs");

// 阻塞代码实例
var data = fs.readFileSync('../../public/file/input.txt');

console.log(data.toString());
console.log("程序执行结束!");