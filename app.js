
App({
  onLaunch: function() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    
  

  },

  // 权限询问
  getRecordAuth: function () {
    wx.getSetting({
      success(res) {
        console.log("succ")
        console.log(res)
        if (!res.authSetting['scope.record']) {
          wx.authorize({
            scope: 'scope.record',
            success() {
              // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
              console.log("succ auth")
            }, fail() {
              console.log("fail auth")
            }
          })
        } else {
          console.log("record has been authed")
        }
      }, fail(res) {
        console.log("fail")
        console.log(res)
      }
    })
  },
    globalData: {
    userInfo: null,
      // requestUrl:'http://47.92.38.70:8285'//线上
      // requestUrl: 'http://192.168.15.146:8087'//本地
      requestUrl:'http://221.216.95.200:8285'//35
      // requestUrl:'https://wxpu.diaochaonline.com'//35域名
      // requestUrl: 'https://wmccpu.diaochaonline.com'//线上
      
  }
   
})