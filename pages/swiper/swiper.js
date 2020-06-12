// 轮播图详情页面
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    requestUrl: '',//服务器路径
    ArticleList: '',
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

var requestUrl = app.globalData.requestUrl;
    this.setData({
      requestUrl:requestUrl
    })
    var id = options.id;
    // console.log("这是轮播图Id:",options.id);
    this.getViewArticle(id);
  },
  /**
   * 获取轮播图数据
   */
  getViewArticle(id) {
    let that = this;
    var requestUrl = that.data.requestUrl;//服务器路径
    wx.request({
      url: requestUrl+"/home/manage/findViewArticle",
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