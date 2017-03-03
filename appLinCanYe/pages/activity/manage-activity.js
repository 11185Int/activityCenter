var app = getApp()
Page({
  data: {
    url: '',
    info: {},
    briefenrolllist: {},
    actimglist: {},
    userid: '',
    acid: '',
  },

  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    console.log('onLoad')
    var that = this
    this.setData({
      url: app.globalData.urlPrefix + '/',
      userid: wx.getStorageSync('userid'),
      acid: app.globalData.acid,
    })
  },

  onShow: function () {
    // 页面初始化 options为页面跳转所带来的参数
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

  //管理参与人员
  managePeople: function () {
    console.log("get")
    wx.navigateTo({
      url: '/pages/activity/manage-people',
    })
  },

  //图像点击处理函数
  bindImgChange: function (e) {
    var that = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有

      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: app.globalData.urlPrefix + '/index.php/Xcx/Date/uploadImg',
          filePath: tempFilePaths[0],
          name: 'activitypic',
          formData: {
            userid: that.data.userid,
            acid: that.data.acid,
          },
          success: function (res) {
            var data = res.data
            console.log(res.data)
            var img = {
              imgid: JSON.parse(res.data).data.imgid,
              imgurl: JSON.parse(res.data).data.path,
            }

            that.data.actimglist.push(img)
            that.setData({
              actimglist: that.data.actimglist
            })
            //do something
          },
          fail: function (res) {
            var data = res.data
            console.log(res.data)
            //do something
          },
        })
      }
    })
  },

  //活动图片点击处理函数
  bindActImgChange: function (e) {
    var item = this.data.actimglist[e.currentTarget.id];
    console.log('item ' + item + ' itemurl= ' + item.imgurl + ' imgid= ' + item.imgid)
    wx.navigateTo({
      url: '/pages/activity/img-detail?url=' + app.globalData.urlPrefix + '/' + item.imgurl
      + '&userid=' + this.data.userid
      + '&imgid=' + item.imgid
      + '&canDelete=true',
    })
  },

  //拨打电话
  call: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.info.mobile 
    })
  }
})