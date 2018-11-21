const UserSql = {
  insert:'INSERT INTO users(userName,password,sex,age,address) VALUES(?,?,?,?,?)',
  delete:'DELETE FROM users WHERE id = ?',
  update: 'UPDATE users SET userName = ?, password = ?, sex = ?, age = ?, address = ? WHERE id = ? ',
  queryAll:'SELECT * FROM users',
  getUserNameInfo: 'SELECT * FROM users WHERE userName = ? ',
  getUserById: 'SELECT * FROM users where id = ?',
  getUserByInfo:'SELECT * FROM users WHERE userName = ? AND password = ? '
};

module.exports = UserSql;