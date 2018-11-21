const Sequelize = require('sequelize');
const Op = Sequelize.Op;
// const moment = require('moment');
const sequelize = new Sequelize('dev_wechat', 'wechat', 'lingshunbao_WeChat',
    {
      host: 'rm-bp1t1x40198fb5uyto.mysql.rds.aliyuncs.com',
      dialect: 'mysql',

      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },

      operatorsAliases: false,
      timezone: '+08:00' //东八时区
    });

const ZmyUser = sequelize.define('ZmyUser',
    {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      userName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      sex: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      age: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    }, {
      tableName: 'zmy_user',
      timestamps: true,
      createdAt: false,
      updatedAt: false,
    });

const AccessToken = sequelize.define('AccessToken',
    {
      accessToken: {
        type: Sequelize.STRING(600),
        allowNull: false,
      },
      requestTime: {
        type: Sequelize.DATE,
        allowNull: false,
        /*get() {
         return moment(this.getDataValue('requestTime')).format('YYYY-MM-DD HH:mm:ss');
         }*/
      },
      expireTime: {
        type: Sequelize.DATE,
        allowNull: false,
        /*get() {
         return moment(this.getDataValue('expireTime')).format('YYYY-MM-DD HH:mm:ss');
         }*/
      }
    },
    {
      tableName: 'access_token',
      timestamps: false,
      createdAt: false,
      updatedAt: false,
    });
AccessToken.removeAttribute('id'); // 移除默认的主键

module.exports = {
  sequelize,
  ZmyUser,
  Op,
  AccessToken,
};