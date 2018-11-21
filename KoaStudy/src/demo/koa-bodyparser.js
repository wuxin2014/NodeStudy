const Koa = require('koa');
const app = new Koa();
const bodyParser = require('koa-bodyparser');

/**
 * koa-bodyparser中间件的使用
 * koa-bodyparser中间件可以把koa2上下文的formData数据解析到ctx.request.body中
 */
app.use(bodyParser());
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
    // 从ctx.request.body中获取请求数据
    ctx.body = ctx.request.body;
  } else {
    ctx.body = '404'
  }
});

app.listen(3000, () => {
  console.log('server already started');
});