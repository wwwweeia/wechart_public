

Page({

  /**
   * 页面的初始数据
   */
  data: {
     icon: ['locationfill'],
    nick:'',
    avataUrl:'',
    icon: ['right'],
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
      hidden: false,
     hidden1: true,
     //openid
      openid:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {

    var that = this;
    var app = getApp();
    var openid = app.openid;
    that.setData({
      openid: openid
    })

    // this.wxLogin();
    //查看是否授权
    // wx.getSetting({
    //   success: function (res) {
    //     if (res.authSetting['scope.userInfo']) {
    //       console.log("用户授权了");
    //     } else {
    //       //用户没有授权
    //       console.log("用户没有授权");
    //     }
    //   }
    // })

  },
bindGetUserInfo: function (res) {
    if (res.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this;
      // 获取到用户的信息了，打印到控制台上看下
      console.log("信息如下：",res);
      console.log(res.detail.userInfo);
      //授权成功后,通过改变 hidden 的值，让实现页面显示出来，把授权页面隐藏起来
      that.setData({
        hidden: true,
        hidden1: false
      });
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          // 用户没有授权成功，不需要改变 isHide 的值
          if (res.confirm) {
            console.log('用户点击了“返回授权”');
          }
        }
      });
    }
  },
  getPhoneNumber:function(e){
    console.log(e)
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
  },
 
 
  goTojubaodetail:function(){
    var that = this;
    var openid = that.data.openid;
    wx.navigateTo({
      url:"../jubaodetail/jubaodetail?openid="+openid
    })
  },
  goToabout:function(){
    wx.navigateTo({
      url: "../about/about"
    })
  }
  //  wxLogin: function(e) {
  //   var that = this;
  //   wx.login({
  //     success: function(res) {
  //       var code = res.code; //发送给服务器的code 
  //       wx.getUserInfo({
  //         success: function(res) {
  //           console.log("这是用户信息：",res)
  //           var userNick = res.userInfo.nickName; //用户昵称 
  //           var avataUrl = res.userInfo.avatarUrl; //用户头像地址 
  //           var gender = res.userInfo.gender; //用户性别 0，未知，1男，2女
  //            console.log("userNick:",userNick);
  //             console.log("avataUrl:",avataUrl);
  //              console.log("gender:",gender);
  //             that.setData({
  //               nick: userNick,
  //               avataUrl: avataUrl
  //             })
  //           if (code !== null) {
  //             wx.request({
  //               //url: 'http://你的域名/wxLogin.php',
  //               //服务器的地址，现在微信小程序只支持https请求，所以调试的时候请勾选不校监安全域名
  //               data: {
  //                 code: code,
  //                 nick: userNick,
  //                 avaurl: avataUrl,
  //                 sex: gender,
  //               },
  //               header: {
  //                 'content-type': 'application/json'
  //               },
  //               success: function(res) {
  //                 console.log("这啥？？？",res);
  //                 console.log("这是啥？？？",res.data);
  //                 wx.setStorageSync('nick', res.data.nick); //将获取信息写入本地缓存 
  //                 wx.setStorageSync('openid', res.data.openid);
  //                 wx.setStorageSync('imgUrl', res.data.imgUrl);
  //                 wx.setStorageSync('sex', res.data.sex);
  //               }
  //             })
  //           } else {
  //             console.log("获取用户登录态失败！");
  //           }
  //         }
  //       })
  //     },
  //     fail: function(error) {
  //       console.log('login failed ' + error);
  //     }
  //   })
  // }
})