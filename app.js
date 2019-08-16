//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    
    let that = this;
    wx.login({
      success(res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            // url: 'http://221.216.95.200:8285/member/manage/userLogin',
            url: 'http://192.168.15.146:8080/member/manage/userLogin',
            
            data: {
              code: res.code
            },
            success(res) {
            //  console.log("请求用户：",res)
              if (res.data.status == 'success'){
                var  app = getApp();
                app.openid = res.data.retObj.openid;
                console.log("这是初始化：",app.openid)
                app.sessionKey = res.data.retObj.sessionKey;
              } else {
                console.log('error')
              }
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })


  },
  globalData: {
    userInfo: null
  }
})