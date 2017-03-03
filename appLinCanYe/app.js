//app.js
App({
  globalData: {
    userInfo: null,
    urlPrefix: "http://192.183.3.91/tpcluster",
    userid: '',
    acid: '',
    enrolllist:{},
  },

  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    var openid = wx.getStorageSync('openid')
    console.log('openid ' + openid)
    var userid = wx.getStorageSync('userid')
    console.log('userid'  + userid)
    this.islogin(openid)
  },

  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function (res) {
          console.log(res)
          wx.getUserInfo({
            success: function (res) {
              console.log(res)
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },

  //判断是否插入数据
  islogin: function (openid) {
    wx.request({
      url: 'http://192.183.3.91/tpcluster' + '/index.php/Xcx/Date/isLogin',
      data: {
        openid: openid
      },
      method: 'POST',
      header: {
        'content-type':'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res);
        if (res.data.status === 1) {
          wx.redirectTo({
            url: "/pages/index/index"
          })
        } else {
          wx.redirectTo({
            url: "/pages/index/signup"
          })
        }
      },
      fail: function (res) {
        console.log(res)
        console.log('fail to login')
      }
    });
  },

})