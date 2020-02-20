
var app = getApp()
Page({
  data: {
    requestUrl: '',//服务器路径
    icon: ['locationfill'],
    //答案ID
    answerId: '',
    //资源
    retObj: [],
    //举报分类
    sort: [],
    //举报图片
    reportImgSrc: [],
    //举报视频
    reportVideoSrc: [],
    //地址图片
    addstImgSrc: [],
    //地址视频
    addsVideoSrc: [],
    //任务进度
    taskRecord: [],
    //任务进度图片
    imgSrc: [],
    //任务进度视频
    videoSrc: [],
    //判断任务进度颜色
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(answerId) {
    var that = this;
    var requestUrl = app.globalData.requestUrl;
    this.setData({
      requestUrl:requestUrl
    })
    var id = answerId.id;
    console.log("id是:", id)
    //获取数据
    that.detail(id);

  },
  //查看 图片 举报图片
  ViewImageForReport(e) {
    // console.log("图片数据：", e);
    wx.previewImage({
      urls: this.data.reportImgSrc,
      current: e.currentTarget.dataset.url
    });
  },
//查看 图片 地址图片
  ViewImageForreportAdds(e) {
    // console.log("图片数据：", e);
    wx.previewImage({
      urls: this.data.addstImgSrc,
      current: e.currentTarget.dataset.url
    });
  },


  ViewVideoForReport(e) {
    //console.log("视频数据：",e);
    this.VideoContext = wx.createVideoContext('reportVideo' + e.currentTarget.dataset.index);
    this.VideoContext.requestFullScreen(0);
    // this.VideoContext.play(e.currentTarget.dataset.url);
  },

  ViewVideoForAdds(e) {
    // console.log("视频数据：", e);
    this.VideoContext = wx.createVideoContext('addVideo' + e.currentTarget.dataset.index);
    this.VideoContext.requestFullScreen(0);
    // this.VideoContext.play(e.currentTarget.dataset.url);
  },


  //发送请求获取数据
  detail: function(id) {
    var that = this;
    var imgSrc = '';
    var taskRecord = that.data.taskRecord;

var requestUrl = that.data.requestUrl;
    wx.request({
      // url: "http://192.168.15.146:8080/home/manage/searchAnswerInfo",
      url: requestUrl+"/home/manage/searchAnswerInfo",
      data: {
        answerId: id
      },
      success(res) {
        // console.log("这是失败返回的数据：",res);
        if (res.data.status === "success") {

          that.setData({

            retObj: res.data.retObj,
            //问题分类
            sort: res.data.retObj.questionSorts,
            //举报图片
            reportImgSrc: res.data.retObj.reportImgSrc,
            //举报视频
            reportVideoSrc: res.data.retObj.reportVideoSrc,
            //地址图片
            addstImgSrc: res.data.retObj.addstImgSrc,
            //地址视频
            addsVideoSrc: res.data.retObj.addsVideoSrc,


          })

        }


      },
      //请求失败
      fail: function(err) {},
      //请求完成后执行的函数
      complete: function() {}


    })


  }

})