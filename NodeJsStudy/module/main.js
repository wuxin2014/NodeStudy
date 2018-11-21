// Node.js 提供了 exports 和 require 两个对象，
// 其中 exports 是模块公开的接口，require 用于从外部获取一个模块的接口，即所获取模块的 exports 对象。

var hello = require('./hello');
hello.world();

var hello2 = require('./hello2'); 
hello2 = new Hello2(); 
hello2.setName('BYVoid'); 
hello2.sayHello(); 