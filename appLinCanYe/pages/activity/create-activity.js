var app = getApp()
Page({
  data: {
    title: "",
    startDate: '2017-01-01',
    startTime: '12:00',

    closingDate: '2017-01-01',
    closingTime: '12:00',

    endDate: '2017-01-01',
    endTime: '12:00',
    address: "",
    issue: "",
    toastHidden: true,
    errInfo: "",
    userid: "",
  },
  bindSDateChange: function (e) {
    this.setData({
      startDate: e.detail.value
    })
  },
  bindSTimeChange: function (e) {
    this.setData({
      startTime: e.detail.value
    })
  },
  bindCDateChange: function (e) {
    this.setData({
      closingDate: e.detail.value
    })
  },
  bindCTimeChange: function (e) {
    this.setData({
      closingTime: e.detail.value
    })
  },
  bindEDateChange: function (e) {
    this.setData({
      endDate: e.detail.value
    })
  },
  bindETimeChange: function (e) {
    this.setData({
      endTime: e.detail.value
    })
  },
  bindViewTap: function () {
    var that = this
    this.data.userid = wx.getStorageSync('userid')
    console.log('remark' + this.data.issue)
    this.addDate(function (res) {
      that.setData({
        toastHidden: false,
        errInfo: res.data.msg,
      })
    }, this.data.userid, this.data.title, this.data.startDate + ' ' + this.data.startTime,
      this.data.closingDate + ' ' + this.data.closingTime,
      this.data.endDate + ' ' + this.data.endTime, this.data.address, this.data.issue)
  },

  bindTitleChange: function (e) {
    this.setData({
      title: e.detail.value
    })
  },

  bindAddressChange: function (e) {
    this.setData({
      address: e.detail.value
    })
  },

  bindIssueChange: function (e) {
    this.setData({
      issue: e.detail.value
    })
  },
  toastChange: function () {
    this.setData({
      toastHidden: true
    })
  },
  //插入活动数据
  addDate: function (cb, userid, title, start_datetime, end_datetime, stop_datetime, address, remark) {
    var that = this
    console.log('remark' + remark)
    wx.request({
      url: app.globalData.urlPrefix + '/index.php/Xcx/Date/addDate',
      data: {
        userid: userid,
        title: title,
        start_datetime: start_datetime,
        end_datetime: end_datetime,
        stop_datetime: stop_datetime,
        address: address,
        remark: remark,
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res);
        if (res.data.status === 1) {
          // wx.showToast({
          //   title: '发布成功',
          //   icon: "success",
          //   duration: 2000
          // })
          wx.redirectTo({
            url: "/pages/index/index"
          })
        } else {
          typeof cb == "function" && cb(res)
        }
      },
      fail: function (res) {
        wx.showToast({
          title: '发布失败',
          icon: "success",
          duration: 2000
        })
        console.log(res)
      }
    });
  },
})