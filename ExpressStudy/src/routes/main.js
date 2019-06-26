var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  const title = req.query.title || 'Express'
  res.set('X-XSS-Protection',0);
  res.render('main', { title });
});

module.exports = router;