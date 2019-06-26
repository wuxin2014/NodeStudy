// 定义了router后，也可以将其作为中间件传递给app.use：
// 匹配路径和路由
module.exports = function (app) {
  app.get('/', function (req, res) {
    res.redirect('/main');
  });
  app.use('/main', require('./main'));
  app.use('/login', require('./login'));
  // app.use('/register', require('./register'));
  // app.use('/users', require('./users'));
  // app.use('/zmyUsers', require('./zmyUsers'));

  // 404错误处理
  app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });


  // 开发环境，500错误处理和错误堆栈跟踪
  if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err
      });
    });
  }

  // 生产环境，500错误处理
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  });
};