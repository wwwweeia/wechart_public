// pages/menuBack/menuBack.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // var code = options.code;
    console.log("看看这个：", options)
    if(options.code){
      var code = options.code;
      wx.setStorageSync('code', code)
       console.log("微信平台跳转code：",code)
    }else{
        var url =  decodeURIComponent(options.q);
        // var code =  url.substr(url.length-4);
         var arr =  url.split("^");
         var code = arr[1].toString();
        wx.setStorageSync('code', code)
        console.log("二维码跳转code：",code)
    }

    wx.switchTab({
      url: '../index/index'
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})