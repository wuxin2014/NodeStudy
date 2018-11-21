const mysql = require('mysql');

function select(sql, values) {
  console.log(values);
  var promise = new Promise(function(resolve,reject) {
    var connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '123456',
    });
    connection.connect();
    connection.query("USE test");
    connection.query(sql, values, function (err, results, fields) {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
    connection.end();
  });

  return promise;
}

module.exports = select;