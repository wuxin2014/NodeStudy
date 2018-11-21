const {authApi, getWxUserInfoApi, getWxUserInfoByBatchgetApi} = require('./api');
const request = require('request');
const {getWxAccessToken} = require('./WxAccessTokenHelper');
const {APPID} = require('./constant');

const SCOPE = 'snsapi_base'; // 静默授权  // snsapi_userinfo 手动授权  // 网页授权access_token // UnionID
const REDIRECT_URI = '';

/**
 * 获取微信code
 */
function getWxCode() {
  const options = {
    url: authApi,
    method: 'post',
    qs: {
      appid: APPID,
      redirect_uri: REDIRECT_URI,
      response_type: 'code',
      scope: SCOPE,
      state: 'STATE#wechat_redirect'
    }
  };
  request(options, function(error, response, body) {
    if(!error && response.code === 200){

    }
  });

}


/**
 * 网页授权后获取用户信息
 * @param code
 * @param needUserInfo 是否需要获取用户信息，默认false
 */
function fetchActive(code, needUserInfo = false) {

}

/**
 *
 */
function fetchPassive() {

}



module.exports = {
  fetchActive,
  fetchPassive,
};