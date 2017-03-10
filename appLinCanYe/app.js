//app.js
App({
  globalData: {
    // urlPrefix: "http://192.183.3.91/tpcluster",
    urlPrefix:"https://weiapp.doyoteam.com/justin",
    userInfo: null,
    enrolllist: {},
    third_session: null,
  },

  onLaunch: function () {
    //调用API从本地缓存中获取数据
    console.log("onLaunch")
    var that = this
    this.globalData.third_session = wx.getStorageSync('third_session')
    if (!this.globalData.third_session) {
      that.login(function () {
        that.getSession()
      })
    }
  },

  //封装好的访问类
  postApi: function (url, data, success) {
    console.log("postApi")
    data.third_session = this.globalData.third_session
    console.log("session " + data.third_session)
    var that = this
    wx.request({
      url: that.globalData.urlPrefix + url,
      data: data,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var result = res.data
        console.log(result)
        if (result.status == 1) {
          typeof success == "function" && success(res.data)
        } else if (result.status == -11 || result.status == -10) {
          that.login(function () {
            that.getSession(function () {
              that.postApi(url, data, success)
            })
          })
        } else {
          wx.showToast({
            title: res.msg,
            icon: "success",
            duration: 2000
          })
        }
      },
      fail: function (res) {
        console.log(res)
      }
    });
  },

  //调用登录接口
  login: function (cb) {
    console.log("login")
    var that = this
    wx.login({
      success: function (res) {
        console.log('code' + res.code)
        if (res.code) {
          that.globalData.code = res.code
          typeof cb == "function" && cb()
        }
      }
    })
  },

  //判断是否已注册
  getSession: function (cb) {
    console.log("getSession")
    var that = this
    console.log("code " + that.globalData.code)
    wx.request({
      url: that.globalData.urlPrefix + '/index.php/Xcx/Date/getSession',
      data: {
        code: that.globalData.code
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res);
        if (res.data.data) {
          console.log("got session")
          that.globalData.third_session = res.data.data.third_session
          wx.setStorageSync('third_session', res.data.data.third_session)
        }
        if (typeof cb == "function") {
          console.log("reget")
          cb(res)
        } else if (res.data.status === 1) {
          wx.setStorageSync('isRegistered', "true")
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