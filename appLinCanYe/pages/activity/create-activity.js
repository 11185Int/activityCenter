var app = getApp()
Date.prototype.format = function (fmt) { //author: meizz 
  var o = {
    "M+": this.getMonth() + 1, //月份 
    "d+": this.getDate(), //日 
    "h+": this.getHours(), //小时 
    "m+": this.getMinutes(), //分 
    "s+": this.getSeconds(), //秒 
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
    "S": this.getMilliseconds() //毫秒 
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

Page({
  data: {
    title: "",
    startDate: null,
    startTime: null,

    closingDate: null,
    closingTime: null,

    endDate: null,
    endTime: null,
    address: "",
    issue: "",
  },

  onShow: function () {
    console.log('onShow')
    this.initDate()
  },

  //初始化时间
  initDate: function () {
    var date = new Date().format("yyyy-MM-dd")
    var time = new Date().format("hh:mm")
    var endTime = new Date()
    endTime.setMinutes(endTime.getMinutes() + 30)
    endTime = endTime.format("hh:mm")
    this.setData({
      startDate: date,
      startTime: time,
      closingDate: date,
      closingTime: endTime,
      endDate: date,
      endTime: endTime,
    })
  },
  bindLocationTap:function() {
    var that = this
    wx.chooseLocation({
      success:function(res) {
      console.log(res)
      console.log(res.address)
      that.setData({
        address:res.address
      })
    }
    })
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
    this.addDate()
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
    console.log("bei zhu " + e.detail.issue)
  },

  //插入活动数据
  addDate: function () {
    var that = this
    console.log("备注 " + this.data.issue)
    app.postApi('/index.php/Xcx/Date/addDate', {
      third_session: app.globalData.third_session,
      title: this.data.title,
      start_datetime: this.data.startDate + ' ' + this.data.startTime,
      end_datetime: this.data.closingDate + ' ' + this.data.closingTime,
      stop_datetime: this.data.endDate + ' ' + this.data.endTime,
      address: this.data.address,
      remark: this.data.issue,
    }, function (res) {
      console.log(res)
      wx.redirectTo({
        url: "/pages/index/index"
      })
    })
  },
})