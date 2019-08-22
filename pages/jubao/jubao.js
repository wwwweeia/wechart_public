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
    CustomBar: app.globalData.CustomBar,
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
    var projectId = wx.getStorageSync('projectId');
    let that = this;
    wx.request({
      // url: "http://192.168.15.146:8080/home/manage/searchQuestionSorts",
      url: "http://221.216.95.200:8285/home/manage/searchQuestionSorts",
      data: {
        "projectId": projectId
      },
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
  onLoad: function(options) {

    qqmapsdk = new QQMapWX({
      key: this.data.key
    });
    this.currentLocation();
    this.getProblemType();
  },


  radioChange: function(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },


  regionchange(e) {
    // 地图发生变化的时候，获取中间点，也就是cover-image指定的位置
    if (e.type == 'end' && (e.causedBy == 'scale' || e.causedBy == 'drag')) {
      this.setData({
        address: "正在获取地址..."
      })
      this.mapCtx = wx.createMapContext("maps");
      this.mapCtx.getCenterLocation({
        type: 'gcj02',
        success: (res) => {
          //console.log(res)
          this.setData({
            latitude: res.latitude,
            longitude: res.longitude
          })
          this.getAddress(res.longitude, res.latitude);
        }
      })
    }
  },
  getAddress: function(lng, lat) {
    //根据经纬度获取地址信息
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: lat,
        longitude: lng
      },
      success: (res) => {
        // console.log(res)
        console.log(res.result.formatted_addresses.recommend)
        this.setData({
          address: res.result.formatted_addresses.recommend //res.result.address
        })
      },
      fail: (res) => {
        this.setData({
          address: "获取位置信息失败"
        })
      }
    })
  },
  currentLocation() {
    //当前位置
    const that = this;
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
        that.getAddress(res.longitude, res.latitude);
      }
    })
  },


  takePhoto() {
    this.ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        this.setData({
          // src: res.tempImagePath
        })
      }
    })
  },
  startRecord() {
    this.ctx.startRecord({
      success: (res) => {
        console.log('startRecord')
      }
    })
  },
  stopRecord() {
    this.ctx.stopRecord({
      success: (res) => {
        this.setData({
          //src: res.tempThumbPath,
          videoSrc: res.tempVideoPath
        })
      }
    })
  },
  error(e) {
    console.log(e.detail)
  },
  showModal(e) {
    console.log(e);
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  showModal2(e) {
    var type = e.currentTarget.dataset.type;
    this.data.type = type;
    this.setData({
      modalName: e.currentTarget.dataset.target,
    })
  },
  //选择问题分类取消按钮
  problemTypeCancel(e) {
    let that = this.data;
    let items = this.data.problemType;
    for (let i = 0; i < items.length; i++) {
      if (items[i].checked == true) {
        items[i].checked = false
      }
    }
    this.setData({
      problemType: items,
      showProblemType: items,
      isShow: false,
      modalName: null
    })
  },
  //选择问题分类  确认按钮
  problemTypeConfirm(e) {
    let that = this.data;
    var show = false;
    var showData = [];
    var num = 0;
    for (let i = 0; i < that.problemType.length; i++) {
      if (that.problemType[i].checked == true) {
        showData.push(that.problemType[i])
        num++
      }
    }
    if (num > 0) {
      show = true
    }
    this.setData({
      showProblemType: showData,
      isShow: show,
      modalName: null
    })
  },
  //问题分类多选框
  ChooseCheckbox(e) {
    let items = this.data.problemType;
    let values = e.currentTarget.dataset.value;
    for (let i = 0, lenI = items.length; i < lenI; ++i) {
      if (items[i].id == values) {
        items[i].checked = !items[i].checked;
        break
      }
    }
    this.setData({
      problemType: items
    })
  },
  ChooseImage(e) {
    var type = this.data.type;
    if (type == 'adds') {
      wx.chooseImage({
        count: 1, //默认9
        sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], //从相册选择
        success: (res) => {
          if (this.data.addressImgList.length != 0) {
            this.setData({
              addressImgList: this.data.addressImgList.concat(res.tempFilePaths),
              modalName: '',
              addslength: this.data.addslength + 1
            })
          } else {
            this.setData({
              addressImgList: res.tempFilePaths,
              modalName: '',
              addslength: this.data.addslength + 1
            })
          }
        },

      });
    } else {
      wx.chooseImage({
        count: 1, //默认9
        sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], //从相册选择
        success: (res) => {
          if (this.data.imgList.length != 0) {
            this.setData({
              imgList: this.data.imgList.concat(res.tempFilePaths),
              modalName: '',
              reportlength: this.data.reportlength + 1
            })
          } else {
            this.setData({
              imgList: res.tempFilePaths,
              modalName: '',
              reportlength: this.data.reportlength + 1
            })
          }
        }
      });
    }
  },
  chooseVideo() {
    let vm = this;
    //因为上传视频返回的数据类型与图片不一样  需要建缩略图的url放到数组中
    var urlArray = [];
    var obj = {
      'src': '',
      'poster': ''
    };
    var type = this.data.type;
    if (type == 'adds') {
      wx.chooseVideo({
        sourceType: ['album', 'camera'],
        maxDuration: 30,
        camera: 'back',
        success: (res) => {
          obj.src = res.tempFilePath
          obj.poster = res.thumbTempFilePath
          urlArray.push(obj)
          if (vm.data.addressVideoList.length != 0) {
            vm.setData({
              addressVideoList: vm.data.addressVideoList.concat(urlArray),
              modalName: '',
              addslength: vm.data.addslength + 1
            })
            //   vm.data.addrvideoSrcs.push(res.tempFilePath)
          } else {
            vm.setData({
              addressVideoList: urlArray,
              modalName: '',
              addslength: vm.data.addslength + 1
            })
            //    vm.data.addrvideoSrcs.push(res.tempFilePath)
          }
        }
      })
    } else {
      wx.chooseVideo({
        sourceType: ['album', 'camera'],
        maxDuration: 30,
        camera: 'back',
        success: (res) => {
          obj.src = res.tempFilePath
          obj.poster = res.thumbTempFilePath
          urlArray.push(obj)
          if (vm.data.videoList.length != 0) {
            vm.setData({
              videoList: vm.data.videoList.concat(urlArray),
              modalName: '',
              reportlength: vm.data.reportlength + 1
            })
            //  vm.data.videoSrcs.push(res.tempFilePath)
          } else {
            vm.setData({
              videoList: urlArray,
              modalName: '',
              reportlength: vm.data.reportlength + 1
            })
            //  vm.data.videoSrcs.push(res.tempFilePath)
          }
        }
      })
    }


  },
  ViewImageForreport(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  ViewVideoForreport(e) {
    console.log("视频的啥？：", e);
    this.VideoContext = wx.createVideoContext('reportVideo' + e.currentTarget.dataset.index);
    this.VideoContext.requestFullScreen(0);
  },
  ViewImageForadds(e) {
    wx.previewImage({
      urls: this.data.addressImgList,
      current: e.currentTarget.dataset.url
    });
  },
  ViewVideoForadds(e) {
    this.VideoContext = wx.createVideoContext('addsVideo' + e.currentTarget.dataset.index);
    this.VideoContext.requestFullScreen(0);
  },
  start(e) {
    let fullScreen = e.detail.fullScreen;
    if (!fullScreen) {
      this.VideoContext.pause();
    } else {
      this.VideoContext.play();
    }

  },
  DelImg(e) {
    // 'reportImg' 举报图片  'reportVideo' 举报视频 'addsImg'地址图片 'addsVideo' 地址视频
    var type = e.currentTarget.dataset.type;
    wx.showModal({
      // title: '召唤师',
      content: '确定要删除这条图片/视频吗？',
      cancelText: '取消',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          if (type == "reportImg") {
            this.data.imgList.splice(e.currentTarget.dataset.index, 1);
            this.setData({
              imgList: this.data.imgList,
              reportlength: this.data.reportlength - 1
            })
          }
          if (type == "reportVideo") {
            this.data.videoList.splice(e.currentTarget.dataset.index, 1);
            this.setData({
              videoList: this.data.videoList,
              reportlength: this.data.reportlength - 1
            })
          }
          if (type == "addsImg") {
            this.data.addressImgList.splice(e.currentTarget.dataset.index, 1);
            this.setData({
              addressImgList: this.data.addressImgList,
              addslength: this.data.addslength - 1
            })
          }
          if (type == "addsVideo") {
            this.data.addressVideoList.splice(e.currentTarget.dataset.index, 1);
            this.setData({
              addressVideoList: this.data.addressVideoList,
              addslength: this.data.addslength - 1
            })
          }

        }
      }
    })
  },
  textareaAInput(e) {

    this.data.desc = e.detail.value;
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },


  //提交按钮
  submit() {
    var projectId = wx.getStorageSync('projectId');
    var that = this;
    //问题分类
    var qustionSort = this.data.showProblemType;
    //举报描述
    var desc = this.data.desc;
    //举报经纬度
    var longitude = this.data.longitude;
    var latitude = this.data.latitude;
    //举报地址
    var address = this.data.address;
    //举报图片集合
    var reportImg = that.data.imgList;
    //举报视频集合
    var reportVideo = that.data.videoList;
    //地址图片集合
    var addsImg = that.data.addressImgList;
    //地址视频集合
    var addsVideo = that.data.addressVideoList;

    var app = getApp();
    var openid = app.openid;
    that.setData({
      openid: openid
    })
    var openid = that.data.openid;
    console.log("普通资源携带的openid:？", openid);

    if (qustionSort.length < 1) {
      wx.showToast({
        title: '请选择问题类型',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return
    }
    if ((reportImg.length + reportVideo.length) < 1) {
      wx.showToast({
        title: '请拍摄举报图片/视频',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return
    }
    // if ((addsImg.length + addsVideo.length) < 1) {
    //   wx.showToast({
    //     title: '请拍摄地点图片/视频',
    //     icon: 'none',
    //     duration: 1000,
    //     mask: true
    //   })
    //   return
    // }
    if (desc == '') {
      wx.showToast({
        title: '请填写举报描述',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return
    }

    var sortIds = '';
    for (let i = 0; i < qustionSort.length; i++) {
      sortIds += qustionSort[i].id + ','
    }
    sortIds = sortIds.substring(0, sortIds.length - 1)
    //发送请求到后台，存储：经纬度、地址、描述、问题ID 
    wx.request({
      // url: "http://192.168.15.146:8080/home/manage/createAnswer",
      url: "http://221.216.95.200:8285/home/manage/createAnswer",
      data: {
        "longitude": longitude,
        "latitude": latitude,
        "address": address,
        "desc": desc,
        "qustionSort": sortIds,
        "openid": openid,
        "projectId": projectId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      dataType: 'json',
      success(res) {
        //console.log("answerId:", res);
        //得到答案id
        // 执行图片上传递归函数
        // that.uploadImage(0, res.data.retObj);
        that.setData({
          answerId: res.data.retObj
        })
        that.uploadImage(res.data.retObj);

      },
      //请求失败
      fail: function(err) {
        console.log("请求失败：", err)
      },
      complete: function() {} //请求完成后执行的函数
    })

    setTimeout(function() {
      wx.hideLoading()
    }, 2000)

  },


  /**
   * 图片/视频资源上传
   * @param e(index) 当前图片下标
   */
  uploadImage: function(answerId) {
    var that = this;

    //举报图片集合
    var reportImg = that.data.imgList;
    //举报视频集合
    var reportVideo = that.data.videoList;
    //地址图片集合
    var addsImg = that.data.addressImgList;
    //地址视频集合
    var addsVideo = that.data.addressVideoList;

    wx.showLoading({
      title: '资源上传中...',
      mask: true,
    })
    if (reportImg.length > 0) {
      //举报图片
      that.reportImg11();
    }
    if (reportVideo.length > 0) {
      //地址图片
      that.addsImg11();
    }
    if (addsImg.length > 0) {
      //举报视频
      that.reportVideo11();
    }
    if (addsVideo.length > 0) {
      //地址视频
      that.addsVideo11();
    }




    setTimeout(function() {
      wx.reLaunch({
        url: "../success/success"
      })
    }, 1000)


  },


  //举报图片集合
  reportImg11: function() {
    var that = this;
    //举报图片集合
    var reportImg = that.data.imgList;
    var answerId = that.data.answerId;
    var i = that.data.i;
    var success = that.data.success;
    var fail = that.data.fail;
    var openid = that.data.openid;
    console.log("图片资源携带的openid:？", openid);

    //上传举报图片
    wx.uploadFile({
      // url: 'http://192.168.15.146:8080/home/manage/upload',
      url: 'http://221.216.95.200:8285/home/manage/upload',
      filePath: reportImg[i],
      name: 'reportImg' + i + openid,
      formData: {
        'answerId': answerId,
        'key': 'reportImg' + i + openid,
        'openid': openid,
      },
      success(res) {
        // 操作成功
        setTimeout(function() {
          wx.hideLoading()
        }, 1000)

        success++;
      },
      //请求失败
      fail: function(err) {
        fail++;
      },
      complete: () => {
        i++;
        if (i >= reportImg.length) { //当图片传完时，停止调用     
          console.log('---上传举报图片执行完毕---');
          console.log('成功：' + success + " 失败：" + fail);
        } else { //若图片还没有传完，则继续调用函数
          that.data.i = i;
          that.data.success = success;
          that.data.fail = fail;
          that.reportImg11();
        }
      }

    })

  },
  //地址图片集合
  addsImg11: function() {
    var that = this;
    //地址图片集合
    var addsImg = that.data.addressImgList;
    var answerId = that.data.answerId;

    var i = that.data.i;
    var success = that.data.success;
    var fail = that.data.fail;
    var openid = that.data.openid;


    wx.uploadFile({
      // url: 'http://192.168.15.146:8080/home/manage/upload',
      url: 'http://221.216.95.200:8285/home/manage/upload',
      filePath: addsImg[i],
      name: 'addsImg' + i + openid,
      formData: {
        'answerId': answerId,
        'key': 'addsImg' + i + openid,
        'openid': openid,
      },
      success(res) {
        // 操作成功
        wx.hideLoading();
        success++;
      },
      //请求失败
      fail: function(err) {
        fail++;
      },
      complete: () => {
        i++;
        if (i >= addsImg.length) { //当图片传完时，停止调用     
          console.log('---上传地址图片执行完毕---');
          console.log('成功：' + success + " 失败：" + fail);
        } else { //若图片还没有传完，则继续调用函数
          that.data.i = i;
          that.data.success = success;
          that.data.fail = fail;
          that.addsImg11();
        }
      }

    })

  },
  //举报视频集合
  reportVideo11: function() {
    var that = this;
    //举报视频集合
    var reportVideo = that.data.videoList;
    var answerId = that.data.answerId;

    var i = that.data.i;
    var success = that.data.success;
    var fail = that.data.fail;
    var openid = that.data.openid;

    wx.uploadFile({
      url: 'http://221.216.95.200:8285/home/manage/upload',
      // url: 'http://192.168.15.146:8080/home/manage/upload',
      filePath: reportVideo[i].src,
      name: 'reportVideo' + i + openid,
      formData: {
        'answerId': answerId,
        'key': 'reportVideo' + i + openid,
        'openid': openid,
      },
      success(res) {
        // 操作成功
        wx.hideLoading();
        success++;
      },
      //请求失败
      fail: function(err) {
        fail++;
      },
      complete: () => {
        i++;
        if (i >= reportVideo.length) { //当图片传完时，停止调用     
          console.log('上传举报视频执行完毕');
          console.log('成功：' + success + " 失败：" + fail);
        } else { //若图片还没有传完，则继续调用函数
          that.data.i = i;
          that.data.success = success;
          that.data.fail = fail;
          that.reportVideo11();
        }
      }

    })


  },
  //地址视频集合
  addsVideo11: function() {

    var that = this;
    //地址视频集合
    var addsVideo = that.data.addressVideoList;
    var answerId = that.data.answerId;

    var i = that.data.i;
    var success = that.data.success0;
    var fail = that.data.fail;
    var openid = that.data.openid;

    wx.uploadFile({
      // url: 'http://192.168.15.146:8080/home/manage/upload',
      url: 'http://221.216.95.200:8285/home/manage/upload',
      filePath: addsVideo[i].src,
      name: 'addsVideo' + i + openid,
      formData: {
        'answerId': answerId,
        'key': 'addsVideo' + i + openid,
        'openid': openid,
      },
      success(res) {
        // 操作成功
        wx.hideLoading();
        success++;
      },
      //请求失败
      fail: function(err) {
        fail++;
      },
      complete: () => {
        i++;
        if (i >= addsVideo.length) { //当图片传完时，停止调用     
          console.log('上传地址视频执行完毕');
          console.log('成功：' + success + " 失败：" + fail);
        } else { //若图片还没有传完，则继续调用函数
          that.data.i = i;
          that.data.success = success;
          that.data.fail = fail;
          that.addsVideo11();
        }
      }


    })
  },

})