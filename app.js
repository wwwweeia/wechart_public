
App({
  onLaunch: function() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 获取用户信息
    let that = this;
    wx.login({
      success(res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: 'http://192.168.15.147:8087/member/manage/userLogin',
            // url: 'https://wxpu.diaochaonline.com/member/manage/userLogin',
            // url: 'http://47.92.38.70:8285/member/manage/userLogin',
            method: "GET",
            header: {
              "Content-Type": "application/json"
            },
            data: {
              govCode: 'TJBS',
              code: res.code
            },
            success(res) {
               console.log("请求用户：",res)
              if (res.data.status == 'success') {
                var app = getApp();
                app.openid = res.data.retObj.openid;
                app.projectId = res.data.retObj.projectId;
                app.sessionKey = res.data.retObj.sessionKey;
                app.projectLat = res.data.retObj.projectLat;
                app.projectLog = res.data.retObj.projectLog;
                // app.judge = res.data.retObj.openid;
                wx.setStorageSync('projectId', app.projectId)
                wx.setStorageSync('projectLat', app.projectLat)
                wx.setStorageSync('projectLog', app.projectLog)
                console.log("这是初始化projectId：", app.projectId)
                console.log("这是初始化openid：", app.openid)
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
      requestUrl: 'http://192.168.15.147:8087'//本地
      // requestUrl:'http://221.216.95.200:8285'//35
      // requestUrl:'https://wxpu.diaochaonline.com'
  }
   
})