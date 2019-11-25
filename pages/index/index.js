//获取应用实例
// const regeneratorRuntime = require('../utils/runtime.js');
var app = getApp()
Page({
  data: {
    requestUrl: '',//服务器路径
    swiperIndex: 0, //初始化swiper索引
    swiperHeight: 350,
    // 问题栏默认值
    TabCur: null,
    // 轮播图数据
    swiperList: [],
    // 问题类型数据
    problemType: [],
    //任务列表数据
    taskList: [],
    //任务列表初始页（默认1）
    pagenum: 1,
    //赋值任务列表总页数（默认1）
    maxPageNum: 1,
    //空内容提示标识
    isNull: ''
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var requestUrl = app.globalData.requestUrl;
    this.setData({
      requestUrl:requestUrl
    })
    console.log("这是啥",requestUrl)
    //加载轮播图
    this.getSwiperList();
    //加载问题栏
    this.getProblemType();
    //默认第一次加载任务列表（全部）
    this.getTaskListAll();

  },

  bindchange(e) {
    this.setData({
      swiperIndex: e.detail.current
    })
  },
  toswiper: function(e) {
    let that = this;
    var id = e.currentTarget.dataset.id;
    var requestUrl = that.data.requestUrl;
    wx.request({
      // url: "http://192.168.15.146:8080/home/manage/findViewArticle",
      url: requestUrl+"/home/manage/findViewArticle",
      data: {
        "viewId": id
      },
      method: "GET",
      header: {
        "Content-Type": "application/json"
      },
      success(res) {
        if (res.data.status === "success" && res.data.retObj != null) {
          that.setData({
            ArticleList: res.data.retObj,
            list: res.data.retObj.content.replace(/\\n/g, "\n")
          })
          wx.navigateTo({
            url: "../swiper/swiper?id=" + e.currentTarget.dataset.id
          })
        }
      }
    })
  },
  /**
   * 获取轮播图数据
   */
  getSwiperList() {
    var projectId = wx.getStorageSync('projectId')
    // console.log(projectId)
    let that = this;
    var requestUrl = that.data.requestUrl;
    wx.request({
      url: requestUrl+"/home/manage/searchViewPages",
      // url: "http://192.168.15.146:8080/home/manage/searchViewPages",
      data: {
        "projectId": projectId
      },
      method: "GET",
      header: {
        "Content-Type": "application/json"
      },
      success(res) {
        // console.log(res);
        if (res.data.status === "success") {
          that.setData({
            swiperList: res.data.retObj
          })
        }
      }
    })
  },

  /**
   * 获取问题类型数据
   */
  getProblemType() {
    var projectId = wx.getStorageSync('projectId')
    let that = this;
    var requestUrl = that.data.requestUrl;
    wx.request({
      url: requestUrl+"/home/manage/searchQuestionSorts",
      // url: 'http://192.168.15.146:8080/home/manage/searchQuestionSorts',
      data: {
        "projectId": projectId
      },
      method: "GET",
      header: {
        "Content-Type": "application/json"
      },
      success(res) {
        // console.log(res);
        if (res.data.status === "success") {
          that.setData({
            problemType: res.data.retObj
          })
        }
      }
    })
  },
  /**
   * 动态改变问题类型的ID，传参加载ID下的任务列表
   */
  tabSelect: function(e) {
    var that = this;
    //console.log(e);
    //  给TabCurf赋值
    if (e.currentTarget.dataset.id != null) {
      this.setData({
        TabCur: e.currentTarget.dataset.id,
        //每次切换问题，清空问题列表
        taskList: [],
        //每次切换问题，给pagenum重新赋值为1
        pagenum: 1
      })
    } else {
      this.setData({
        taskList: [],
        TabCur: null,
      })
    }

    //根据问题Id发请求
    if (e.currentTarget.dataset.id != null) {
      //传参问题Id获取任务列表
      that.getTaskList(that.data.TabCur);
    } else {
      //获取全部任务列表
      that.getTaskListAll();
    }

  },


  /**
   * 获取任务列表数据
   * 第一次默认加载全部，这里只加载一次，后面根据当前问题的ID发送请求
   */
  getTaskList: function(e) {
    var projectId = wx.getStorageSync('projectId')
    var that = this;

var requestUrl = that.data.requestUrl;
    //console.log(e);
    wx.request({

      url: requestUrl+"/home/manage/searchTaskListIndex",
      // url: "http://192.168.15.146:8080/home/manage/searchTaskList",
      data: {
        "sortId": e,
        "page": that.data.pagenum,
        "projectId": projectId
      },
      method: "GET",
      header: {
        "Content-Type": "application/json"
      },
      success(res) {
        //console.log(res);
        if (res.data.status === "success") {
          that.setData({
            taskList: that.data.taskList.concat(res.data.retObj),
            maxPageNum: res.data.retObj[0].maxPageNum,
            isNull: ''
          })
        } else {
          that.setData({
            isNull: 'true',
            maxPageNum: 1
          })
        }
      },
      fail: function(err) {}, //请求失败
      complete: function() {} //请求完成后执行的函数
    })
  },
  //获取全部任务列表（页面加载）
  getTaskListAll: function() {
    var projectId = wx.getStorageSync('projectId')
    var that = this;

var requestUrl = that.data.requestUrl;
    wx.request({
      url: requestUrl+"/home/manage/searchTaskListIndex",
      // url: "http://192.168.15.146:8080/home/manage/searchTaskList",
      data: {
        "page": that.data.pagenum,
        "projectId": projectId
      },
      method: "GET",
      header: {
        "Content-Type": "application/json"
      },
      success(res) {
        if (res.data.status === "success") {
          console.log("任务列表",res)
          that.setData({
            //1、that.data.taskList  获取当前页面存的taskList数组
            //2、res.data.retObj   获取当前请求得到的taskList数组
            //3、xxx.concat  把新加载的数组追加到当前页面之后
            taskList: that.data.taskList.concat(res.data.retObj),
            //从当前请求得到总页数给maxPageNum赋值
            maxPageNum: res.data.retObj[0].maxPageNum,
            isNull: '',
          })
        } else {
          isNull: 'true'
        }
        // 隐藏加载框
        wx.hideLoading();
      },
      fail: function(err) {
        console.log('gg')
      }, //请求失败
      complete: function() {} //请求完成后执行的函数
    })

  },
  //上拉函数
  onReachBottom: function() { //触底开始下一页
    var that = this;
    var pagenum = that.data.pagenum + 1; //获取当前页数并+1
    that.setData({
      pagenum: pagenum, //更新当前页数
    })

    if (that.data.maxPageNum >= pagenum) {
      if (that.data.TabCur != null) {
        that.getTaskList(that.data.TabCur); //重新调用请求获取下一页数据
      } else {
        that.getTaskListAll(); //全部
      }
      // 显示加载图标
      wx.showLoading({
        title: '玩命加载中',
      })

    } else {
      // 显示加载图标
      wx.showLoading({
        title: '没有更多了',
      })

    }
    // 隐藏加载框
    setTimeout(function() {
      wx.hideLoading()
    }, 1000)


  },

})