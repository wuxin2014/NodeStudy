var server = require("./routerServer");
var router = require("./router");
 
server.start(router.route);