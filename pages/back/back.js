Page({
  data: {
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
    var id = answerId.id;
    that.setData({
      answerId: id
    })
    // console.log("这是失败详情答案Id:",answerId.id);
    //获取数据
    that.detail();

  },
  ViewImageForreport(e) {
    // console.log("图片数据：", e);
    wx.previewImage({
      urls: this.data.reportImgSrc,
      current: e.currentTarget.dataset.url
    });
  },
  ViewVideoForreport(e) {
    //console.log("视频数据：",e);
    this.VideoContext = wx.createVideoContext('reportVideo' + e.currentTarget.dataset.index);
    this.VideoContext.requestFullScreen(0);
  },
  ViewImageForreport1(e) {
    // console.log("图片数据11：", e.currentTarget.dataset.url);
    wx.previewImage({
      urls: this.data.reportImgSrc,
      current: e.currentTarget.dataset.url
    });
  },
  ViewVideoForreport1(e) {
    // console.log("视频数据：",e);
    this.VideoContext = wx.createVideoContext('reportVideo' + e.currentTarget.dataset.index);
    this.VideoContext.requestFullScreen(0);
  },

  //发送请求获取数据
  detail: function() {
    var that = this;
    var imgSrc = '';
    var taskRecord = that.data.taskRecord;
    wx.request({
      url: "http://221.216.95.200:8285/home/manage/searchAnswerInfo",
      data:{
          answerId:that.data.answerId
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
      complete: function() {
          }
         

      })
 
         
  }

})