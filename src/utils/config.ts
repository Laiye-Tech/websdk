const pkg = require('../../package.json')
// const isProd = process.env.NODE_ENV === 'production'
// const MODE = window.__WEB_SDK_CONF__ && window.__WEB_SDK_CONF__.ENV.MODE
const BASE_URL = 'https://newtestcb2.wul.ai'

// if (MODE === 'pre') {
//   BASE_URL = 'https://precb2.wul.ai'
// } else if (MODE === 'dev' || !isProd) {
//   BASE_URL = 'https://newtestcb2.wul.ai'
// } else if (MODE === 'test') {
//   BASE_URL = 'https://newtestcb2.wul.ai'
// } else {
//   BASE_URL = 'https://cb2.wul.ai'
// }

function getAppInfo() {
  return {
    version: `v${pkg.version}`,
    source: 'WEB_SDK'
  }
}

function getUserInfo() {
  if (window.localStorage.getItem('SDK_USER_INFO')) {
    const result = JSON.parse(window.localStorage.getItem('SDK_USER_INFO'))
    return result
  }

  return null
}

export {
  BASE_URL,
  getAppInfo,
  getUserInfo
}
