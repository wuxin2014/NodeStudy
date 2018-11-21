const koa = require('koa');
const app = new koa();
const fs = require('fs');

// 自己编写路径的监听
function render(page) {
  return new Promise((resolve, reject) => {
    let pageUrl = `../page/${page}`;
    console.log(pageUrl);
    fs.readFile(pageUrl, "utf-8", (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

async function route(url) {
  let page = '404.html';
  switch(url){
    case '/' :
      page = 'index.html';
      break;
    case '/login':
      page = '/login.html';
      break;
    case '/reg':
      page = '/reg.html';
      break;
    default: 
      page = '404.html';
      break;
  }
  let html = await render(page);
  return html;
}

app.use(async(ctx) => {
  let url = ctx.request.url;
  let html = await route(url);
  ctx.body = html;
});

app.listen(3000, () => {
  console.log('server already started');
});