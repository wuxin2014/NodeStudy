const {AccessToken} = require('../db/dbDevConfig');
const request = require('request');
const fs = require("fs");

const getWxAccessTokenFromWxApi = 'https://api.weixin.qq.com/cgi-bin/token';
const APPID = 'wx5d47b8125f53edfb';
const APP_SECRET = '230af3de49aadcf985de72f430f76156';

async function getWxAccessToken(expiredToken) {
  try {
    // 从文件获取accessToken数据
    const data = await getTokenFromFile();
    if (data.accessToken) {
      console.log('从文件获取accessToken数据');
      let accessToken = data.accessToken;
      const expireTime = data.expireTime;
      return await handleIsExpire(accessToken, expireTime, expiredToken);
    } else {
      // 文件不存在,从数据库中获取数据
      const queryResult = await AccessToken.findAll({
        attributes: ['accessToken', 'requestTime', 'expireTime']
      });
      if(queryResult.length > 0) {
        // 获取数据库的数据
        let accessToken = queryResult[0].accessToken;
        const expireTime = queryResult[0].expireTime;
        return await handleIsExpire(accessToken, expireTime);
      } else {
        // 无当前accessToken，向微信异步获取
        return await getWxAccessTokenFromWx();
      }
    }
  } catch (e) {
    console.log(e);
    return {errrorMsg: e};
  }
}

async function handleIsExpire(accessToken, expireTime, expiredToken) {
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
    }, function(error, response, body) {
      // body.errcode 40013 appid无效
      // body.errcode 40125 secret
      if (!error && response.statusCode == 200) {
        const data = JSON.parse(body);
        const {access_token, errmsg} = data;
        let result = {};
        if(access_token) {
          result.accessToken =  access_token;
          saveAccessToken(access_token);
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

function saveAccessToken(accessToken) {
  const requestTime = new Date();
  const expireTime = new Date(requestTime.getTime() + (120-3) * 60 * 1000);
  const tokenObj = {
    accessToken,
    requestTime,
    expireTime,
  };
  saveTokenToFile(tokenObj);
  saveTokenToDB(tokenObj);
}

/**
 * 将token对象保存到db
 * @param tokenObj
 */
async function saveTokenToDB(tokenObj) {
  try {

    const queryResult = await AccessToken.findAll({
      attributes: ['accessToken', 'requestTime', 'expireTime']
    });

    if(queryResult.length > 0){
      // 数据库中有数据，则更新
      const updateAccessToken = await AccessToken.update(tokenObj, {
        where:{
          accessToken: queryResult[0].accessToken
        }
      });
      console.log('updateAccessToken', updateAccessToken);
    } else {
      // 数据库中无数据，则插入
      const insertAccessToken = await AccessToken.create(tokenObj);
      console.log('insertAccessToken', insertAccessToken);
    }
  } catch (error) {
    console.log('errrorMsg', error);
  }
}

/**
 * 将token对象保存到文件中
 * @param token对象包括access_token、requestTime、expireTime
 */
function saveTokenToFile(token) {
  // fs.writeFile(filename,data,[options],callback)
  fs.writeFile('public/files/access_token.txt', JSON.stringify(token), function(err, data) {
    if (err) {
      throw err;
    }
    console.log(data);
  });
}


/**
 * 从文件中读取accessToken
 */
async function getTokenFromFile() {
  return new Promise(function(resolve,reject){
    fs.readFile('public/files/access_token.txt', 'utf-8', function(err,data) {
      if(err) return reject(err);
      resolve(JSON.parse(data));
    });
  });
}


function isValid(accessToken, expireTime) {
  var curTime = new Date().getTime();
  if(expireTime.getTime){
    expireTime = expireTime.getTime();
  } else {
    expireTime = new Date(expireTime).getTime();
  }
  return !!accessToken && curTime < expireTime;
}

module.exports = {
  getWxAccessToken,
  getWxAccessTokenFromWx,
};