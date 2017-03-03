// pages/activity/join-activity.js
// import onfire from 'onfire.js';

var app = getApp()
Page({
  data: {
    url: '',
    info: {},
    briefenrolllist: {},
    userid: '',
    acid: '',
    people: '',
    reason: '',
    status: '',
    joinHidden: true,
    refuseHidden: true,
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    console.log('onLoad')
    var that = this
    this.setData({
      url: app.globalData.urlPrefix + "/",
      userid: wx.getStorageSync('userid'),
      acid: app.globalData.acid,
    })
  },

  onShow: function () {
    console.log('onShow')
    var that = this
    this.getActInfo(function (res) {
      that.setData({
        info: res.data.data.acinfo,
        briefenrolllist: res.data.data.acinfo.enrolllist.slice(0, 11),
        actimglist: res.data.data.acinfo.imgList,
      })
      app.globalData.enrolllist = that.data.info.enrolllist
    }, this.data.userid, this.data.acid)
  },

  onShareAppMessage: function () {
    return {
      title: '约跑',
      path: '/pages/activity/join-activity'
    }
  },
  joinClick: function () {
    this.setData({
      joinHidden: false
    })
  },
  refuseClick: function () {
    this.setData({
      refuseHidden: false
    })
  },
  joinChange: function (e) {
    var that = this
    if (this.data.people == '') {
      this.data.people = 1
    }
    this.enrollYes(function (res) {
      that.setData({
        joinHidden: true
      })
      wx.redirectTo({
        url: '/pages/activity/join-activity',
      })
    }, this.data.userid, this.data.acid, this.data.people)
  },
  refuseChange: function (e) {
    var that = this
    this.enrollNo(function (res) {
      that.setData({
        refuseHidden: true
      })
      wx.redirectTo({
        url: '/pages/activity/join-activity',
      })
    }, this.data.userid, this.data.acid, this.data.reason)
  },

  peopleChange: function (e) {
    this.setData({
      people: e.detail.value,
    })
  },

  reasonChange: function (e) {
    this.setData({
      reason: e.detail.value,
    })
  },

  call: function () {
    console.log('call')
    var that = this
    wx.makePhoneCall({
      phoneNumber: that.data.info.mobile
    })
  },

  //获取活动详情
  getActInfo: function (cb, userid, acid) {
    var that = this
    console.log('userid' + userid)
    console.log("acid " + acid)
    wx.request({
      url: app.globalData.urlPrefix + '/index.php/Xcx/Date/acInfo',
      data: {
        userid: userid,
        acid: acid
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.msg === "成功" && typeof cb == "function") {
          cb(res)
        }
      },
      fail: function (res) {
        console.log(res.data)
      }
    });
  },
  //参与活动
  enrollYes: function (cb, userid, acid, people) {
    var that = this
    console.log('userid' + userid)
    console.log('people ' + people)
    wx.request({
      url: app.globalData.urlPrefix + '/index.php/Xcx/Date/enrollYes',
      data: {
        userid: userid,
        acid: acid,
        people: people,
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.status === 1 && typeof cb == "function") {
          cb(res)
          wx.showToast({
            title: '报名成功',
            icon: "success",
            duration: 2000
          })
        } else {
          that.setData({
            joinHidden: true
          })
          wx.showToast({
            title: res.data.msg,
            icon: "success",
            duration: 2000
          })
        }
      },
      fail: function (res) {
        console.log(res.data)
      }
    });
  },

  //拒绝活动
  enrollNo: function (cb, userid, acid, reason) {
    var that = this
    console.log('userid' + userid)
    console.log('acid' + acid)
    wx.request({
      url: app.globalData.urlPrefix + '/index.php/Xcx/Date/enrollNo',
      data: {
        userid: userid,
        acid: acid,
        reason: reason,
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.status === 1 && typeof cb == "function") {
          cb(res)
          wx.showToast({
            title: '拒绝成功',
            icon: "success",
            duration: 2000
          })
        } else {
          that.setData({
            refuseHidden: true
          })
          wx.showToast({
            title: res.data.msg,
            icon: "fail",
            duration: 2000
          })
        }
      },
      fail: function (res) {
        console.log(res.data)
      }
    });
  },

  //管理参与人员
  managePeople: function () {
    wx.navigateTo({
      url: '/pages/activity/manage-people',
    })
  },

  //活动图片点击处理函数
  bindActImgChange: function (e) {
    var item = this.data.actimglist[e.currentTarget.id];
    wx.navigateTo({
      url: '/pages/activity/img-detail?url=' + app.globalData.urlPrefix + '/' + item.imgurl
      + '&userid=' + this.data.userid
      + '&imgid=' + item.imgid
      + '&canDelete=false',
    })
  },
  
  //拨打电话
  call: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.info.mobile 
    })
  }
})