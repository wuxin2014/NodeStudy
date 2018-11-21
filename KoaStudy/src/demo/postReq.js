const Koa = require('koa');
const app = new Koa();

/**
 * 获取POST请求的步骤
 * 1、解析上下文ctx的原生node.js对象req
 * 2、将POST表单数据解析成querystring 字符串
 * 3、将字符串转换成JOSN数据格式
 * 
 * ctx.request 跟ctx.req的区别
 * 1、ctx.request:是koa2中context经过封装的请求对象，用起来更直观和简单
 * 2、ctx.req:是context提供的node.js原生的HTTP请求对象，用起来不直观，但可以获得更多内容，适合深度编程
 * 
 * ctx.method是koa2提供的获取请求类型：GET/POST
 */

app.use(async(ctx) => {
  if(ctx.url === '/' && ctx.method === 'GET') {
    let html = `
      <form method="POST" action="/">
        <label>userName: <input type="text" name="userName"/></label><br/>
        <label>pwd: <input type="password" name="pwd" /></label><br/>
        <button type="submit">提交</button>
      </form>
    `;
    ctx.body = html;
  } else if(ctx.url === '/' && ctx.method === 'POST') {
    ctx.body = '执行post请求'
  } else {
    ctx.body = '404'
  }
});

app.listen(3000, () => {
  console.log('server already stared');
});