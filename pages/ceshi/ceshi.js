const QQMapWX = require('../../libs/qqmap-wx-jssdk.min.js');
let qqmapsdk;
//获取应用实例
const app = getApp()
Page({
  data: {
    address: "正在获取地址...",
    longitude: 116.397452,
    latitude: 39.909042,
    key: 'W4WBZ-TUD65-IDAIR-QPM36-HMFQ5-CGBZP',

    //框架属性
    // CustomBar: app.globalData.CustomBar,
    //分类显示判断标志
    isShow: false,
    //框架测试多选框属性
    //ColorList: app.globalData.ColorList,
    //问题分类多选框数组
    problemType: [],
    //问题分类已选择显示数组
    showProblemType: [],
    //图片上传数据
    imgList: [],
    //视频上传数据
    videoList: [],
    //举报视频资源路径
    //videoSrcs:[],
    //地址图片或视频缩略图
    addressImgList: [],
    //地址图片或视频上传数据
    addressVideoList: [],
    //地址视频资源路径
    //addrvideoSrcs:[],
    //举报内容
    textareaAValue: '',
    //上传资源所属类别(举报or地址)
    type: '',
    //地址资源总长度   限制上传数量
    addslength: 0,
    //举报资源总长度  限制上传数量
    reportlength: 0,
    //举报描述
    desc: '',
    ids: [],
    test: [],
    //上传资源绑定的问题ID
    answerId: '',
    //上传的第几个资源
    i: 0,
    //成功个数
    success: 0,
    //失败个数
    fail: 0,
    //openid
    openid: ''
  },


  /**
     * 获取问题类型数据
     */
  getProblemType() {
    let that = this;
    wx.request({
      url: "http://192.168.15.146:8080/home/manage/searchQuestionSorts",
      // url: "http://221.216.95.200:8285/home/manage/searchQuestionSorts",
      success(res) {
        if (res.data.httpStatusCode === 200) {
          console.log("进来了")
          for (let i = 0; i < res.data.retObj.length; i++) {
            i.checked == false;
          }
          that.setData({
            problemType: res.data.retObj
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.thisWhy()
  },
  // onLoad(options) {
  //    console.log("进来了吗：",options)
  //   // qqmapsdk = new QQMapWX({
  //   //   key: this.data.key
  //   // });
  //   // this.currentLocation();
  //   // this.getProblemType();
  //   this.thisWhy()
  // },

  thisWhy: function () {
    console.log("这是测试方法")
  },


  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },

  onLoad: function (options) {
    qqmapsdk = new QQMapWX({
      key: this.data.key
    });
    this.currentLocation()
  },

})