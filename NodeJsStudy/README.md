# NodeJsStudy
1、安装node
2、window检测PATH环境变量是否配置了Node.js
3、查看node的版本命令： node -v
4、查看npm的版本命令：npm -v
5、Window系统npm的升级命令：npm install npm -g

6、npm 的包安装分为本地安装（local）、全局安装（global）两种
例如：
npm install express          # 本地安装
npm install express -g   # 全局安装
本地安装
(1)将安装包放在 ./node_modules 下（运行 npm 命令时所在的目录），如果没有 node_modules 目录，会在当前执行 npm 命令的目录下生成 node_modules 目录。
(2)可以通过 require() 来引入本地安装的包。
全局安装
(1)将安装包放在 /usr/local 下或者你 node 的安装目录。
(2)可以直接在命令行里使用。


7、查看安装信息：npm list -g
8、
9、卸载模块：npm uninstall express
10、npm ls
11、更新模块： npm undate express
12、搜索模块：npm search express



NPM提供了很多命令，例如install和publish，使用npm help可查看所有命令。
使用npm help <command>可查看某条命令的详细帮助，例如npm help install。
在package.json所在目录下使用npm install . -g可先在本地安装当前命令行程序，可用于发布前的本地测试。
使用npm update <package>可以把当前目录下node_modules子目录里边的对应模块更新至最新版本。
使用npm update <package> -g可以把全局安装的对应命令行程序更新至最新版。
使用npm cache clear可以清空NPM本地缓存，用于对付使用相同版本号发布新版本代码的人。
使用npm unpublish <package>@<version>可以撤销发布自己发布过的某个版本代码。


使用淘宝 NPM 镜像
npm install -g cnpm --registry=https://registry.npm.taobao.org
使用 cnpm 命令来安装模块
cnpm install [name]
查看cnpm版本命令： cnpm -v