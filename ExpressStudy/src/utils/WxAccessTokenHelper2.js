const {AccessToken} = require('../db/dbDevConfig');
const request = require('request');
// import {AccessToken} from '../db/dbDevConfig';

const getWxAccessTokenFromWxApi = 'https://api.weixin.qq.com/cgi-bin/token';
const APPID = 'wx5d47b8125f53edfb';
const APP_SECRET = '230af3de49aadcf985de72f430f76156';


// 日期格式化
Date.prototype.format = function(format) {
  const MONTH_OF_QUARTER = 3;
  const LIB_INDEX_SUNDAY = 0;
  const LOCAL_INDEX_SUNDAY = 7;
  const o = {
    'M+': this.getMonth() + 1,
    'd+': this.getDate(),
    'h+': this.getHours(),
    'H+': this.getHours(),
    'm+': this.getMinutes(),
    's+': this.getSeconds(),
    'q+': Math.floor((this.getMonth() + MONTH_OF_QUARTER) / MONTH_OF_QUARTER),
    S: this.getMilliseconds(),
  };
  if (/(y+)/.test(format)) {
    const YEAR_LENGTH_MAX = 4;
    format = format.replace(RegExp.$1,
        `${this.getFullYear()}`.substr(YEAR_LENGTH_MAX - RegExp.$1.length));
  }
  if (/(E+)/.test(format)) {
    format = format.replace(RegExp.$1,
        DAYS_VALUE_MAP[this.getDay() === LIB_INDEX_SUNDAY ?
            LOCAL_INDEX_SUNDAY :
            this.getDay()]);
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(format)) {
      format = format.replace(RegExp.$1,
          RegExp.$1.length === 1 ? o[k] : (`00${o[k]}`).substr(`${o[k]}`.length));
    }
  }
  return format;
};

async function getWxAccessToken(expiredToken) {
  try {
    const queryResult = await AccessToken.findAll({
      attributes: ['accessToken', 'requestTime', 'expireTime']
    });
    if(queryResult.length > 0) {
      // 获取数据库的数据
      let accessToken = queryResult[0].accessToken;
      const expireTime = queryResult[0].expireTime;
      console.log('expireTime', expireTime);
      console.log('requestTime', queryResult[0].requestTime);

/*
      // 判断accessToken是否已过期
      if (accessToken && expireTime && isValid(accessToken, expireTime)) {
        // 有当前accessToken，未过期
        if (expiredToken && expiredToken === accessToken) {
          // 强制刷新, 向微信异步获取
          return await getWxAccessTokenFromWx();
        } else {
          // 非强制刷新
          return {accessToken}
        }
      } else {
        // 有当前accessToken，已过期, 向微信异步获取
        return await getWxAccessTokenFromWx();
      }*/
    } else {
      // 无当前accessToken，向微信异步获取
      return await getWxAccessTokenFromWx();
    }
  } catch (e) {
    return {errrorMsg: e};
  }
}


function getWxAccessTokenFromWx() {
  return new Promise((resolve, reject) => {
    request({
      url: getWxAccessTokenFromWxApi,
      method: 'get',
      qs: {
        grant_type: 'client_credential',
        appid: APPID,
        secret: APP_SECRET
      }
    }, async function(error, response, body) {
      // body.errcode 40013 appid无效
      // body.errcode 40125 secret
      if (!error && response.statusCode == 200) {
        const data = JSON.parse(body);
        const {access_token, errmsg} = data;
        let result = {};
        if(access_token) {
          result.accessToken =  access_token;
          await saveAccessToken(access_token);
        } else if (errmsg) {
          result.errorMsg =  errmsg;
        }
        resolve(result);
      } else {
        reject({errorMsg: error});
      }
    });
  });
}

async function saveAccessToken(accessToken) {
  try {
    const requestTime = new Date();
    const expireTime = new Date(requestTime.getTime() + (120-3) * 60 * 1000);

    console.log('requestTime', requestTime.format('yyyy-MM-dd HH:mm:ss'));
    console.log('expireTime', expireTime.format('yyyy-MM-dd HH:mm:ss'));

    const queryResult = await AccessToken.findAll({
      attributes: ['accessToken', 'requestTime', 'expireTime']
    });

    const params = {
      accessToken,
      requestTime: requestTime.format('yyyy-MM-dd HH:mm:ss'),
      expireTime: expireTime.format('yyyy-MM-dd HH:mm:ss'),
    };


    if(queryResult.length > 0){
      // 数据库中有数据，则更新
      const updateAccessToken = await AccessToken.update(params, {
        where:{
          accessToken: queryResult[0].accessToken
        }
      });
      console.log('updateAccessToken', updateAccessToken);
    } else {
      // 数据库中无数据，则插入
      const insertAccessToken = await AccessToken.create(params);
      console.log('insertAccessToken', insertAccessToken);
    }
  } catch (error) {
    console.log('errrorMsg', error);
  }
}

function isValid(accessToken, expireTime) {
  var curTime = new Date().getTime();
  console.log('curTime', curTime);
  console.log('expireTime', expireTime.getTime());
  console.log(curTime < expireTime.getTime());
  console.log(accessToken && curTime < expireTime.getTime());
  return !!accessToken && curTime < expireTime.getTime();
}

/**
 * 从文件中读取accessToken
 * @returns {Promise.<void>}
 */
async function getTokenFromFile() {
  const content = await fs.readFile('access_token.txt', 'utf-8');
  return JSON.parse(content);
}

/**
 * 将token对象保存到文件中
 * @param token
 * @returns {Promise.<void>}
 */
async function saveTokenToFile(token) {
  await fs.writeFile('access_token.txt', JSON.stringify(token));
}


module.exports = {
  getWxAccessToken,
  getWxAccessTokenFromWx,
};