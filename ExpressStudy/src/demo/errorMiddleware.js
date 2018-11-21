const Express  = require('express');
const app = Express();

app.set('views', './views');
app.set('view engine', 'ejs');

app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);

function logErrors(err, req, res, next) {
  console.error(err.stack);
  next(err);
}

function clientErrorHandler(err, req, res, next) {
  if (req.xhr) {
    res.status(500).send({ error: 'Something blew up!' });
  } else {
    next(err);
  }
}

// next() 和 next(err) 类似于 Promise.resolve() 和 Promise.reject()
app.get('/', function (req, res) {
  // 结束请求响应
  res.send('Hello World!');
});

function errorHandler(err, req, res, next) {
  res.status(500);
  res.render('error', { title: err });
}

app.listen(3000, () => {
  console.log('服务已启动');
});