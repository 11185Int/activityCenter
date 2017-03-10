var app = getApp()
Page({
  data: {
    url: app.globalData.urlPrefix + '/',
    info: {},
    briefenrolllist: {},
    actimglist: {},
    acid: '',
  },

  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    console.log('onLoad')
    if (options) {
      this.data.acid = options.acid
    }
  },

  onShow: function () {
    // 页面初始化 options为页面跳转所带来的参数
    console.log('onShow')
    this.getActInfo()
  },

  onShareAppMessage: function () {
    return {
      title: '约跑',
      path: '/pages/activity/join-activity?acid=' + this.data.acid
    }
  },

//获取活动详情
  getActInfo: function () {
    var that = this
    app.postApi('/index.php/Xcx/Date/acInfo', {
      third_session: app.globalData.third_session,
      acid: that.data.acid,
    }, function (res) {
      that.setData({
        info: res.data.acinfo,
        briefenrolllist: res.data.acinfo.enrolllist.slice(0, 11),
        actimglist: res.data.acinfo.imgList,
      })
      app.globalData.enrolllist = that.data.info.enrolllist
    })
  },

  //管理参与人员
  managePeople: function () {
    console.log("get")
    wx.navigateTo({
      url: '/pages/activity/manage-people',
    })
  },

  //图像上传处理函数
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
            third_session: app.globalData.third_session,
            acid: that.data.acid,
          },
          success: function (res) {
            var data = res.data
            console.log(res.data)
            var img = {
              imgid: JSON.parse(res.data).data.imgid,
              imgurl: JSON.parse(res.data).data.path,
            }
            console.log("img " + img.imgurl)

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