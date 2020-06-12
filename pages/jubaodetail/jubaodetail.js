//个人中心页面
var app = getApp()
Page({

  data: {
    requestUrl: '',//服务器路径
  
     tab:[
     '待审核',"处理中",'已完成',"已退回"
    ],
  
    TabCur: 0,
    //任务列表初始页（默认1）
    pagenum: 1,
     //赋值任务列表总页数（默认1）
    maxPageNum: 1,
    //退回集合
    backList:[],
    //已完成集合
    finishList:[],
    //空内容提示标识
    isNull: '',
    //openid
    openid:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that = this;
    var requestUrl = app.globalData.requestUrl;
    this.setData({
        openid: options.openid,
        requestUrl:requestUrl
    })
    var openid = this.data.openid;
    if(openid != null && openid != ''){
      // console.log("openid有值,查询数据")
      //初始加载待审核
       this.finish(3,openid);
    }else{
      // 显示加载图标
      wx.showLoading({
        title: '网络异常!!!',
        mask: true,
      })
       // 隐藏加载框
    setTimeout(function() {
      wx.hideLoading()
    }, 2000)
    }
    
  },
   tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      //每次切换问题，给pagenum重新赋值为1
        pagenum: 1,
        //每次切换问题，清空问题列表
        backList: [],
        finishList:[]
    })
    // console.log("现在的id",e.currentTarget.dataset.id)
    var openid = this.data.openid;
    if(openid != null && openid != ''){
      // 0整改达标，1未整改，2整改不达标继续整改，3已整改（待审核)
      // 已完成    处理中     已退回     待审核
      // 0和1查任务  2和3查答案 finish是答案
          if(e.currentTarget.dataset.id === 0){
            this.finish(3,openid);
          }
          if(e.currentTarget.dataset.id === 1){
            this.back(1,openid);
          }
          if(e.currentTarget.dataset.id === 2){
            this.back(0,openid);
          }
          if(e.currentTarget.dataset.id === 3){
            this.finish(2,openid);
          }
         
    }else{
      // 显示加载图标
      wx.showLoading({
        title: '网络异常!!!',
        mask: true,
      })
       // 隐藏加载框
    setTimeout(function() {
      wx.hideLoading()
    }, 2000)
    }
   

  },
  back:function(e,openid){
    // console.log("这是退回：",e)
    //  console.log("这是退回openid：",openid)
    var projectId = wx.getStorageSync('projectId')
    var that = this;

var requestUrl = that.data.requestUrl;//服务器路径
    wx.request({
      url: requestUrl+"/home/manage/searchTaskList",
      // url: "http://192.168.15.146:8080/home/manage/searchTaskList",
      data: {
        "status": e,
         "page": that.data.pagenum,
         "openid":openid,
         "projectId":projectId
      },
      success(res) {
        // console.log("退回：",res);
        if (res.data.status === "success") {
          that.setData({
            backList: that.data.backList.concat(res.data.retObj),
            //从当前请求得到总页数给maxPageNum赋值
            maxPageNum: res.data.retObj[0].maxPageNum,
            isNull: ''
          })
        }else{
          that.setData({
            isNull: 'true'
          })
        }
      },
      fail: function(err) {}, //请求失败
      complete: function() {} //请求完成后执行的函数
    })
  },

  finish:function(e,openid){
    // console.log("这是完成：",e)
    // console.log("这是完成openid：",openid)
    var projectId = wx.getStorageSync('projectId')
    var that = this;

var requestUrl = that.data.requestUrl;//服务器路径
    wx.request({
      //  url: "http://192.168.15.146:8080/home/manage/searchTaskList",
      url: requestUrl+"/home/manage/searchTaskList",
      data: {
        "status": e,
        "page": that.data.pagenum,
         "openid":openid,
         "projectId":projectId
      },
      success(res) {
        // console.log("成功：",res);
        if (res.data.status === "success") {
          that.setData({
             finishList: that.data.finishList.concat(res.data.retObj),
            //finishList: res.data.retObj,
             //从当前请求得到总页数给maxPageNum赋值
            maxPageNum: res.data.retObj[0].maxPageNum,
            isNull:''
          })
          // console.log("finishList集合：",that.data.finishList)
        }else{
          that.setData({
            isNull: 'true'
          })
        }
      },
      fail: function(err) {}, //请求失败
      complete: function() {} //请求完成后执行的函数
    })
  },
    //上拉函数
  onReachBottom: function() { //触底开始下一页
    var that = this;
    var openid = that.data.openid;
    var pagenum = that.data.pagenum + 1; //获取当前页数并+1
    that.setData({
      pagenum: pagenum, //更新当前页数
    })

    if (that.data.maxPageNum >= pagenum) {
     
     var tab = that.data.TabCur;
     if(tab === 0){
      this.finish(3,openid);
     }
     if(tab === 1){
      this.back(1,openid);
     }

     if(tab === 2){
      this.back(0,openid);
     }

     if(tab === 3){
      this.finish(2,openid);
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