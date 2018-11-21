const {AccessToken, sequelize} = require('../db/dbDevConfig');
const request = require('request');
const {getWxAccessTokenFromWxApi} = require('./api');
const {APPID, APP_SECRET} = require('./constant');

// 内存中变量
let tempAccessToken = '';
let tempExpireTime = null;

async function getWxAccessToken(expiredToken) {
  if (tempAccessToken === '' || !tempExpireTime) {
    // 如果内存不存在access_token， 从数据库中获取
    const queryResult = await AccessToken.findAll({
      attributes: ['accessToken', 'requestTime', 'expireTime'],
    });
    if (queryResult.length > 0) {
      const accessToken = queryResult[0].accessToken;
      const expireTime = queryResult[0].expireTime;

      // 将数据保存到到内存中
      tempAccessToken = accessToken;
      tempExpireTime = expireTime;
    }
  }
  return await handleIsExpire(tempAccessToken, tempExpireTime, expiredToken);
}

function handleIsExpire(accessToken, expireTime, expiredToken) {
  // 判断accessToken是否已过期
  if (accessToken && expireTime && isValid(accessToken, expireTime)) {
    // 有当前accessToken，未过期
    if (expiredToken && expiredToken === accessToken) {
      // 强制刷新, 向微信异步获取
      return getWxAccessTokenFromWx();
    } else {
      // 非强制刷新
      return {accessToken};
    }
  } else {
    // 有当前accessToken，已过期, 向微信异步获取
    return getWxAccessTokenFromWx();
  }
}

let sIsFetching = false;
const sCallbackList = [];
/**
 * 调用微信接口获取access_token
 * @returns {Promise}
 */
function getWxAccessTokenFromWx() {
  console.log('getWxAccessTokenFromWx');
  return new Promise((resolve, reject) => {
    if (sIsFetching) {
      sCallbackList.push(resolve);
      return;
    } else {
      sIsFetching = true;
      sCallbackList.push(resolve);
    }
    request({
      url: getWxAccessTokenFromWxApi,
      method: 'get',
      qs: {
        grant_type: 'client_credential',
        appid: APPID,
        secret: APP_SECRET,
      },
    }, async function(error, response, body) {
      // body.errcode 40013 appid无效
      // body.errcode 40125 secret
      let result = {};
      if (!error && response.statusCode === 200) {
        const wxData = JSON.parse(body);
        const {access_token} = wxData;
        if (access_token) {
          await saveAccessToken(wxData);
        }
        result = wxData;
      } else {
        result.errorMsg = error;
      }

      for (let i = 0; i < sCallbackList.length; i++) {
        sCallbackList.pop()(result);
      }

      sIsFetching = false;

    });
  });
}

async function saveAccessToken(wxData) {
  const accessToken = wxData.access_token;
  const expireIn = wxData.expires_in;
  const requestTime = new Date();
  const expireTime = new Date(
      requestTime.getTime() + (expireIn - 3 * 60) * 1000);

  const tokenObj = {
    accessToken,
    requestTime,
    expireTime,
  };

  // 保存数据到内存
  tempAccessToken = accessToken;
  tempExpireTime = expireTime;

  // 保存数据到数据库
  await saveTokenToDB(tokenObj);
}

/**
 * 将token对象保存到db
 * @param tokenObj
 */
async function saveTokenToDB(tokenObj) {
  const transaction = await sequelize.transaction();
  try {
    const queryResult = await AccessToken.findAll({
      attributes: ['accessToken', 'requestTime', 'expireTime'],
    });

    if (queryResult.length > 0) {
      // 数据库中有数据，则更新
      const updateAccessToken = await AccessToken.update(tokenObj, {
        where: {
          accessToken: queryResult[0].accessToken,
        },
        transaction,
      });
      console.log('updateAccessToken', updateAccessToken);
    } else {
      // 数据库中无数据，则插入
      const insertAccessToken = await AccessToken.create(tokenObj,
          {transaction});
      console.log('insertAccessToken', insertAccessToken);
    }

    await transaction.commit();
  } catch (error) {
    // 回滚
    await transaction.rollback();
    console.log('errrorMsg', error);
  }
}

function isValid(accessToken, expireTime) {
  const curTime = new Date().getTime();
  if (expireTime.getTime) {
    expireTime = expireTime.getTime();
  } else {
    expireTime = new Date(expireTime).getTime();
  }
  return !!accessToken && curTime < expireTime;
}

module.exports = {
  getWxAccessToken,
};