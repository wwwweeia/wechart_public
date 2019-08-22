// pages/swiper/swiper.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ArticleList: '',
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var id = options.id;
    // console.log("这是轮播图Id:",options.id);
    this.getViewArticle(id);
  },
  /**
   * 获取轮播图数据
   */
  getViewArticle(id) {
    let that = this;
    wx.request({
      url: "http://221.216.95.200:8285/home/manage/findViewArticle",
      // url: "http://192.168.15.146:8080/home/manage/findViewArticle",
      data: {
        "viewId": id
      },
      success(res) {
        if (res.data.status === "success") {
          that.setData({
            ArticleList: res.data.retObj,
            list: res.data.retObj.content.replace(/\\n/g, "\n")
          })

        }
      }
    })
  },

})