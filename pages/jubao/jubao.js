//举报上传页面
const QQMapWX = require('../../libs/qqmap-wx-jssdk.min.js');
//同步js
import regeneratorRuntime from '../../libs/regenerator-runtime/runtime.js';
let qqmapsdk;
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js')

const plugin = requirePlugin("WechatSI")

// 获取**全局唯一**的语音识别管理器**recordRecoManager**
const manager = plugin.getRecordRecognitionManager()

Page({
  data: {
    requestUrl: '',//服务器路径
    address: "正在获取地址...",
    longitude: 116.397452,
    latitude: 39.909042,
    // key: 'W4WBZ-TUD65-IDAIR-QPM36-HMFQ5-CGBZP',
    key:'HLKBZ-4DQLK-W2CJS-AUXAC-Y4433-JLF64',
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
    //openid
    openid: '',
    // 项目地址
    projectCity: '',
    // 用户地址
    userCity: '',
    bottomButtonDisabled: false, // 底部按钮disabled
    recording: false,  // 正在录音
    recordStatus: 0,  // 状态： 0 - 录音中 1- 翻译中 2 - 翻译完成/二次翻译
    resourceList: [], // 封装资源列表
    hidden:false,
    hiddenUser:false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    addIsShow:true,
    addIsShowB:true,
    addIsShowA:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var requestUrl = app.globalData.requestUrl;
     var openid = app.openid;
    var projectId = wx.getStorageSync('projectId');
    var nickname =  wx.getStorageSync('nickname');
     // console.log("nickname",nickname)
     if (nickname) {
      // console.log("有值")
      this.setData({
        hidden:true
      })
     }else{
      // console.log("无值")
      this.setData({
        hiddenUser:true
      })
     }
    this.setData({
      requestUrl:requestUrl,
      openid:openid,
      projectId:projectId
    })
    this.initRecord()
    qqmapsdk = new QQMapWX({
      key: this.data.key
    });
    this.currentLocation();
    this.getProblemType();
  },
  //地址拍摄的控制
  addressGoA:function(){
    this.setData({
      addIsShow:false,
      addIsShowA:true,
      addIsShowB:false
    })
  },
  addressGoB:function(){
    this.setData({
      addIsShow:true,
      addIsShowA:false,
      addIsShowB:true,
      addressImgList: [],
      addressVideoList: []
    })

  },


  bindGetUserInfo: function (res) {

    if (res.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this;
      // 获取到用户的信息了，打印到控制台上看下
      // console.log("信息如下：",res);
      // console.log(res.detail.userInfo);
      //授权成功后,通过改变 hidden 的值，让实现页面显示出来，把授权页面隐藏起来
      that.setData({
        hidden: true,
        hiddenUser: false
      });
      var requestUrl = that.data.requestUrl;
      var city = res.detail.userInfo.city;
      var country = res.detail.userInfo.country;
      var gender = res.detail.userInfo.gender;
      var language = res.detail.userInfo.language;
      var nickName = res.detail.userInfo.nickName;
      var province = res.detail.userInfo.province;
      var openid = that.data.openid;

      wx.request({
        // 必需
        url: requestUrl+'/member/manage/saveUser',
        data: {
          city:city,
          country:country,
          gender:gender,
          language:language,
          nickName:nickName,
          province:province,
          openid:openid
        },
        method:"POST",
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: (res) => {
          // console.log(res)
          if (res.data.status==="success") {
            // console.log("保存成功")
          }
        },
        fail: (res) => {
          
        },
        complete: (res) => {
          
        }
      })


    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法上报问题，请授权!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          // 用户没有授权成功，不需要改变 isHide 的值
          if (res.confirm) {
            // console.log('用户点击了“返回授权”');
          }
        }
      });
    }
  },
  /**
     * 按住按钮开始语音识别
     */
  streamRecord: function (e) {
    //console.log("streamrecord", e)
    wx.showToast({
      title: '请按住讲话~',
      icon: 'loading',
      //image: '/images/loading_transition.gif',
      duration: 60000,
      success: function (res) {

      },
      fail: function (res) {
        //console.log(res);
      }
    });
    manager.start({
    })
  },


  /**
   * 松开按钮结束语音识别
   */
  streamRecordEnd: function (e) {

    //console.log("streamRecordEnd", e)
    wx.showToast({
      title: '正在转换~',
      icon: 'loading',
      duration: 1000,
      success: function (res) {

      },
      fail: function (res) {
        //console.log(res);
      }
    });
    manager.stop()
    this.setData({
      bottomButtonDisabled: true,
    })
  },
  /**
    * 识别内容为空时的反馈
    */
  showRecordEmptyTip: function () {
    this.setData({
      recording: false,
      bottomButtonDisabled: false,
    })
    wx.showToast({
      title: '请大声点~',
      icon: 'success',
      image: '/images/no_voice.png',
      duration: 1000,
      success: function (res) {

      },
      fail: function (res) {
        //console.log(res);
      }
    });
  },


  /**
   * 初始化语音识别回调
   * 绑定语音播放开始事件
   */
  initRecord: function () {
    //有新的识别内容返回，则会调用此事件
    manager.onRecognize = (res) => {
      //console.log('新的内容');
    }

    // 识别结束事件
    manager.onStop = (res) => {
      let text = res.result
      //console.log(text)
      if (text == '') {
        this.showRecordEmptyTip()
        return
      }
      this.data.desc = text
      this.setData({
        desc : text
      })
    
    }

    // 识别错误事件
    manager.onError = (res) => {

      this.setData({
        recording: false,
        bottomButtonDisabled: false,
      })

    }

    // 语音播放开始事件
    wx.onBackgroundAudioPlay(res => {

      const backgroundAudioManager = wx.getBackgroundAudioManager()
      let src = backgroundAudioManager.src

      this.setData({
        currentTranslateVoice: src
      })

    })
  },

  /**
   * 获取问题类型数据
   */
  getProblemType() {
    var projectId = wx.getStorageSync('projectId');
    let that = this;
    var requestUrl = that.data.requestUrl;
    wx.request({
      url: requestUrl+"/home/manage/searchQuestionSorts",
      // url: "http://221.216.95.200:8285/home/manage/searchQuestionSorts",
      data: {
        "projectId": projectId
      },
      success(res) {
        if (res.data.httpStatusCode === 200) {
          // console.log("进来了")
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
        // console.log(res.result.formatted_addresses.recommend)
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
  getDps:function(){
        wx.getSystemInfo({
        success(res) {
        var isopendingwei = res.locationEnabled;
        if(isopendingwei==false){
            
            wx.showModal({
              title: '提示',
              content: '请先开启手机GPS定位,然后点击刷新按钮重试',
              showCancel:false,
              success (res) {
                if (res.confirm) {
                  // console.log('用户点击确定')
                } 
              }})
            return
        }
      }
    })

      },

  currentLocation() {
    //当前位置
    const that = this;
    //获取系统权限是否开启
    that.getDps();
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
        that.getAddress(res.longitude, res.latitude);
        that.getLocationByUsert(res.longitude, res.latitude);
      }
    })
    var log = wx.getStorageSync('projectLog')
    var lat = wx.getStorageSync('projectLat')
    that.getLocationByProject(log, lat);

  },

  //经纬度获取用户位置
  getLocationByUsert: function(log, lat) {
    var that = this;
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: lat,
        longitude: log
      },
      success: function(res) {
        let UserCity = res.result.address_component.city;
        that.setData({
          userCity: UserCity
        })
        // console.log("用户地址：",UserCity)
        // that.userAndProject();
      }
    })
  },
  //经纬度获取项目位置
  getLocationByProject: function(log, lat) {
    var that = this;
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: lat,
        longitude: log
      },
      success: function(res) {
        let projectCity = res.result.address_component.city;
        that.setData({
          projectCity: projectCity
        })
        // console.log("项目地址：",projectCity)
      }
    })
  },
  // 对比地址
  userAndProject: function() {
    var projectCity = this.data.projectCity;
    var userCity = this.data.userCity;
    if (projectCity != userCity) {
      this.showToast();
    }
  },
  //提示未开通服务，跳转首页
  showToast() {
    this.toast = this.selectComponent("#tui-tips-ctx")
    let params = {
      icon: true
    };
    params.title = "您所在的位置暂未开通服务";
    params.imgUrl = "/images/toast/info-circle.png";
    params.duration = 3000;
    this.toast.show(params);
    setTimeout(function() {
      wx.reLaunch({
        url: "../index/index"
      })
    }, 3000)
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
        // console.log('startRecord')
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
    // console.log(e.detail)
  },
  showModal(e) {
    // console.log(e);
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
        compressed: false,
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
        compressed: false,
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
    // console.log("视频的啥？：", e);
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
    // console.log(e.detail.value)
    this.data.desc = e.detail.value;
  },
  hideModal(e) {
    // console.log("点击了",e)
    this.setData({
      modalName: null
    })
  },
  submit_syn:function(){
    var  that = this;
        //获取系统权限是否开启
     wx.getSystemInfo({
        success(res) {
        var isopendingwei = res.locationEnabled;
        if(isopendingwei==false){
            wx.showModal({
              title: '提示',
              content: '请先开启手机GPS定位,然后点击刷新按钮重试',
              showCancel:false,
              success (res) {
                if (res.confirm) {
                  // console.log('用户点击确定')
                } 
              }})
          }else{
            that.submit_syn_ready();
          }
        }
      })
     var address = that.data.address;
     if (address =="正在获取地址...") {
      wx.showToast({
        title: '请点击刷新按钮获取位置',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return
    }
  },
  //提交按钮111
  submit_syn_ready: async function(){
     var that = this;
       //举报图片集合
    var reportImg = that.data.imgList;
    //举报视频集合
    var reportVideo = that.data.videoList;
    //地址图片集合
    var addsImg = that.data.addressImgList;
    //地址视频集合
    var addsVideo = that.data.addressVideoList;
    //问题分类
    var qustionSort = this.data.showProblemType;
    // 举报描述
    var desc = this.data.desc;
  
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
    wx.showLoading({
      title: '上传中',
      mask: true
    })
    //举报图片
     for (var index = 0; index < reportImg.length; index++) {
      await that.reportImg_syn(reportImg[index]).then((res) => {
        // console.log("举报图片上传完了resourceList:",that.data.resourceList);
      })
    }
    //举报视频
    for (var index = 0; index < reportVideo.length; index++) {
      await that.reportVideo_syn(reportVideo[index].src).then((res) => {
        // console.log("视频上传完了resourceList:",that.data.resourceList);
      });
    }
    //地址图片
     for (var index = 0; index < addsImg.length; index++) {
      await that.addsImg_syn(addsImg[index]).then((res) => {
        // console.log("地址图片上传完了resourceList:",that.data.resourceList);
      })
    }
    //地址视频
     for (var index = 0; index < addsVideo.length; index++) {
      await that.addsVideo_syn(addsVideo[index].src).then((res) => {
        // console.log("地址视频上传完了resourceList:",that.data.resourceList);
      })
    }
    wx.hideLoading();
    var length = reportImg.length + reportVideo.length + addsImg.length + addsVideo.length;

    // 上传成功的资源长度
    var rsLength = that.data.resourceList.length;
    // console.log("上传成功总资源：", rsLength);
    // console.log("本地总资源:", length)
    // 资源全部上传成功 上传答案
    if (length == rsLength) {
      // wx.showToast({
      //   title: '资源上传中',
      //   icon: 'none',
      //   duration: 1000,
      //   mask: true
      // })
      that.uploadAnswerTrue();
    } else { //有资源上传失败
      wx.showToast({
        title: '有资源上传失败',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      // 清空资源列表
      that.setData({
        resourceList: []
      })
    }
  },
  //上传答案/资源
  uploadAnswerTrue:function(){
    var that = this;
    
    var openid = that.data.openid;
    var projectId  = that.data.projectId;
    var requestUrl  = that.data.requestUrl;
    //问题分类
    var qustionSort = that.data.showProblemType;
    //举报描述
    var desc = that.data.desc;
    //举报经纬度
    var longitude = that.data.longitude;
    var latitude = that.data.latitude;
    //举报地址
    var address = that.data.address;
     //问题分类
    var qustionSort = that.data.showProblemType;
    var sortIds = '';
    for (let i = 0; i < qustionSort.length; i++) {
      sortIds += qustionSort[i].id + ','
    }
    sortIds = sortIds.substring(0, sortIds.length - 1)
    var resourceList = that.data.resourceList;

    //发送请求到后台，存储：经纬度、地址、描述、问题ID 
    wx.request({
      // url: "http://192.168.15.146:8080/home/manage/createAnswer",
      url: requestUrl+"/home/manage/createAnswer_syn",
      data: {
        "longitude": longitude,
        "latitude": latitude,
        "address": address,
        "desc": desc,
        "qustionSort": sortIds,
        "openid": openid,
        "projectId": projectId,
        "resourceListStr":JSON.stringify(resourceList)
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      dataType: 'json',
      success(res) {
          // console.log("上传答案结束,",res)
          if (res.data.status==='success') {
              wx.reLaunch({
                url: "../success/success"
              })
          }else{
            wx.showToast({
              title: res.data.message,
              icon: 'none',
              duration: 1000,
              mask: true
            })
          }
      },
      //请求失败
      fail: function(err) {
        // console.log("请求失败：", err)
      },
      complete: function() {} //请求完成后执行的函数
    })
  },

 //举报图片集合
  reportImg_syn: function(filePath) {
    var that = this;
    var requestUrl = that.data.requestUrl;//服务器路径
    var projectId = that.data.projectId;
    var openid = that.data.openid;
    var resourceList = that.data.resourceList;
  
    //上传举报图片
    return new Promise((resolve, reject) => {
    wx.uploadFile({
      // url: 'http://192.168.15.146:8080/home/manage/upload',
      url: requestUrl+'/home/manage/upload_syn',
      name:'reportImg' + openid,
      filePath: filePath,
      formData: {
        'key': 'reportImg' + openid,
        'openid': openid,
        'projectId':projectId,
        'type':0
      },
      success(res) {
         // console.log("后台返回的举报图片数据：", res)
          var imageMap = JSON.parse(res.data);
          if (imageMap.url != null && imageMap.url != '') {
            // 操作成功
            resolve(res.data)
              resourceList.push({
                url: imageMap.url,
                type: 0,
                style: 0,
                delUrl: imageMap.delUrl
              })
          } else {
            wx.showToast({
              title: '举报图片资源上传失败',
              icon: 'none',
              duration: 1000,
              mask: true
            })
          }

      },
      //请求失败
      fail: function(err) {
      },
      complete: () => {
        // console.log('---上传举报图片执行完毕---');
      }
      })
    })
  },
  //举报视频集合
  reportVideo_syn: function(filePath) {
    var that = this;
    var requestUrl = that.data.requestUrl;//服务器路径
    var projectId = that.data.projectId;
    var openid = that.data.openid;
    var resourceList = that.data.resourceList;
     return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: requestUrl+'/home/manage/upload_syn',
      // url: 'http://192.168.15.146:8080/home/manage/upload',
      filePath: filePath,
      name:'reportVideo' + openid,
      formData: {
        'key': 'reportVideo'+ openid,
        'openid': openid,
        'projectId':projectId,
        'type':2
      },
      success(res) {
         // console.log("后台返回的举报视频片数据：", res)
          var imageMap = JSON.parse(res.data);
          if (imageMap.url != null && imageMap.url != '') {
            // 操作成功
            resolve(res.data)
              resourceList.push({
                url: imageMap.url,
                type: 2,
                style: 0,
                delUrl: imageMap.delUrl
              })
          } else {
            wx.showToast({
              title: '举报视频资源上传失败',
              icon: 'none',
              duration: 1000,
              mask: true
            })
          }
      },
      //请求失败
      fail: function(err) {
      },
      complete: () => {
        // console.log('上传举报视频执行完毕');
      }

    })
    })
  },
   //地址图片集合
  addsImg_syn: function(filePath) {
    var that = this;
    var requestUrl = that.data.requestUrl;//服务器路径
    var projectId = that.data.projectId;
    var openid = that.data.openid;
    var resourceList = that.data.resourceList;
     return new Promise((resolve, reject) => {
    wx.uploadFile({
      // url: 'http://192.168.15.146:8080/home/manage/upload',
      url: requestUrl+'/home/manage/upload_syn',
      filePath: filePath,
      name:'addsImg' + openid,
      formData: {
        'key': 'addsImg' + openid,
        'openid': openid,
        'projectId':projectId,
        'type':0
      },
      success(res) {
         // console.log("后台返回的地址图片数据：", res)
          var imageMap = JSON.parse(res.data);
          if (imageMap.url != null && imageMap.url != '') {
            // 操作成功
            resolve(res.data)
              resourceList.push({
                url: imageMap.url,
                type: 0,
                style: 1,
                delUrl: imageMap.delUrl
              })
          } else {
            wx.showToast({
              title: '地址图片资源上传失败',
              icon: 'none',
              duration: 1000,
              mask: true
            })
          }
      },
      //请求失败
      fail: function(err) {
      },
      complete: () => {
          // console.log('---上传地址图片执行完毕---');
        }
    })
     })
  },
  //地址视频
  addsVideo_syn: function(filePath) {
    var that = this;
    var requestUrl = that.data.requestUrl;//服务器路径
    var projectId = that.data.projectId;
    var openid = that.data.openid;
    var resourceList = that.data.resourceList;
     return new Promise((resolve, reject) => {
    wx.uploadFile({
      // url: 'http://192.168.15.146:8080/home/manage/upload',
      url: requestUrl+'/home/manage/upload_syn',
      filePath: filePath,
      name:'addsVideo' + openid,
      formData: {
        'key': 'addsVideo'+ openid,
        'projectId':projectId,
        'openid': openid,
        'type':2
      },
      success(res) {
         // console.log("后台返回的地址视频数据：", res)
          var imageMap = JSON.parse(res.data);
          if (imageMap.url != null && imageMap.url != '') {
            // 操作成功
            resolve(res.data)
              resourceList.push({
                url: imageMap.url,
                type: 2,
                style: 1,
                delUrl: imageMap.delUrl
              })
          } else {
            wx.showToast({
              title: '地址视频资源上传失败',
              icon: 'none',
              duration: 1000,
              mask: true
            })
          }
      },
      //请求失败
      fail: function(err) {
      },
      complete: () => {
          // console.log('上传地址视频执行完毕');
      }

    })
    })
  },


})