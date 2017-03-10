var app = getApp()
Page({
  data: {
    departArray: ['技术部', '产品部', '视觉部', '综合部', '运营部'],
    departIndex: 0,
    userInfo: null,
    name: "",
    mobile: "",
    department: "",
    userid: "",
    toastHidden: true,
    isChangeInfo: true,
    errInfo: "",
    imgUrl: '',
  },

  onLoad: function (option) {
    console.log('onLoad')
    if (!option.name) {
      this.data.isChangeInfo = false
    }

    var that = this
    //调用应用实例的方法获取数据
    this.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo,
        imgUrl: userInfo.avatarUrl,
        name: option.name,
        mobile: option.mobile,
        department: option.department,
        userid: option.userid,
      })
    })
  },

  //获取用户信息
  getUserInfo: function (cb) {
    console.log("getUserInfo")
    if (this.data.userInfo) {
      console.log("url " + userInfo.avatarUrl)
      typeof cb == "function" && cb(this.data.userInfo)
    } else {
      //调用登录接口
      console.log("geturl ")
      var that = this
      wx.getUserInfo({
        success: function (res) {
          typeof cb == "function" && cb(res.userInfo)
        }
      })
    }
  },

  //部门处理函数
  bindPickerChange: function (e) {
    this.setData({
      departIndex: e.detail.value
    })
  },
  //事件处理函数
  bindViewTap: function () {
    var that = this
    console.log("isChange " + this.data.isChangeInfo)
    if (!this.data.isChangeInfo) {
      console.log("add")
      this.addUserInfo(function (res) {
        that.setData({
          toastHidden: false,
          errInfo: res.data.msg,
        })
      }, this.data.mobile, this.data.departArray[this.data.departIndex], this.data.name, this.data.mobile, this.data.userInfo.nickName, this.data.imgUrl)
    } else {
      console.log("change")
      console.log('user ' + this.data.userid)
      this.changeUserInfo(this.data.userid, this.data.departArray[this.data.departIndex], this.data.name, this.data.mobile)
    }

  },
  bindNameChange: function (e) {
    this.setData({
      name: e.detail.value
    })
    console.log(this.data.name)
  },
  bindMobileChange: function (e) {
    this.setData({
      mobile: e.detail.value
    })
  },

  //插入用户数据
  addUserInfo: function (cb, openid, department, name, mobile, nickname, headimgurl) {
    var that = this
    app.postApi('/index.php/Xcx/Date/addUserInfo', {
      third_session: app.globalData.third_session,
      department: department,
      name: name,
      mobile: mobile,
      nickname: nickname,
      headimgurl: headimgurl,
    }, function (res) {
      console.log(res)
      wx.redirectTo({
        url: "/pages/index/index"
      })
    })
  },

  //修改用户数据
  changeUserInfo: function (userid, department, name, mobile) {
    console.log('user ' + userid)
    var that = this
    wx.request({
      url: app.globalData.urlPrefix + '/index.php/Xcx/Date/saveUserInfo',
      data: {
        userid: userid,
        department: department,
        name: name,
        mobile: mobile,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res.data)
        // wx.showToast({
        //   title: '修改成功',
        //   icon: "success",
        //   duration: 2000
        // })
        // success
        wx.redirectTo({
          url: "/pages/index/index"
        })
      },
      fail: function () {
        console.log(res.data)
        wx.showToast({
          title: '修改失败',
          icon: "success",
          duration: 2000
        })
        // fail
      },
      complete: function () {
        // complete
      }
    })
  }
})
