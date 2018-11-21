var fs = require("fs");
var zlib = require('zlib');

// 解压 input.txt.gz 文件为 input.txt
fs.createReadStream('../..//public/file/input.txt.gz')
  .pipe(zlib.createGunzip())
  .pipe(fs.createWriteStream('../../public/file/inputs.txt'));
  
console.log("文件解压完成。");