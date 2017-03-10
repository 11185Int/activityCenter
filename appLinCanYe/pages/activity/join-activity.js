// pages/activity/join-activity.js
// import onfire from 'onfire.js';

var app = getApp()
Page({
  data: {
    url: app.globalData.urlPrefix + "/",
    info: {},
    briefenrolllist: {},
    acid: '',
    people: '1',
    reason: '',
    status: '',
    joinHidden: true,
    refuseHidden: true,
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    console.log('onLoad')
    var that = this
    if (options) {
      this.data.acid = options.acid
    }

  },

  onShow: function () {
    console.log('onShow')
    var that = this
    this.getActInfo()
  },

  onShareAppMessage: function () {
    return {
      title: '约跑',
      path: '/pages/activity/join-activity?acid=' + this.data.acid
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
    this.enrollYes()
  },
  refuseChange: function (e) {
    var that = this
    this.enrollNo()
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
  getActInfo: function () {
    var that = this
    app.postApi('/index.php/Xcx/Date/acInfo', {
      third_session: app.globalData.third_session,
      acid: this.data.acid,
    }, function (res) {
      that.setData({
        info: res.data.acinfo,
        briefenrolllist: res.data.acinfo.enrolllist.slice(0, 11),
        actimglist: res.data.acinfo.imgList,
      })
      app.globalData.enrolllist = that.data.info.enrolllist
    })
  },
  //参与活动
  enrollYes: function () {
    var that = this
    console.log("people " + this.data.people)
    app.postApi('/index.php/Xcx/Date/enrollYes', {
      third_session: app.globalData.third_session,
      acid: this.data.acid,
      people: this.data.people,
    }, function (res) {
      that.setData({
        joinHidden: true
      })
      wx.showToast({
        title: '报名成功',
        icon: "success",
        duration: 2000
      })
      wx.redirectTo({
        url: '/pages/activity/join-activity?acid=' + that.data.acid,
      })
    })
  },

  //拒绝活动
  enrollNo: function () {
    var that = this
    app.postApi('/index.php/Xcx/Date/enrollNo', {
      third_session: app.globalData.third_session,
      acid: this.data.acid,
      reason: this.data.reason,
    }, function (res) {
      that.setData({
        refuseHidden: true
      })
      wx.showToast({
        title: '拒绝成功',
        icon: "success",
        duration: 2000
      })
      wx.redirectTo({
        url: '/pages/activity/join-activity?acid=' + that.data.acid,
      })
    })
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