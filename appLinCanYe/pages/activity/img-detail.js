var app = getApp()
Page({
    data: {
        url: '',
        userid: '',
        imgid: '',
        canDelete: ''
    },

    onLoad: function (option) {
        console.log(option)
        this.setData({
            url: option.url,
            userid: option.userid,
            imgid: option.imgid,
            canDelete: Boolean(option.canDelete),
        })

        console.log("canDelete " + this.data.canDelete)
    },

    saveClick: function (e) {
        wx.downloadFile({
            url: this.data.url, //仅为示例，并非真实的资源
            success: function (res) {
                wx.saveFile({
                    tempFilePath: res.tempFilePath,
                    success: function (res) {
                        // success
                        console.log(res.data)
                        wx.showToast({
                            title: '保存成功',
                            icon: "success",
                            duration: 2000
                        })
                    },
                    fail: function () {
                        // fail
                        console.log('fail')
                        wx.showToast({
                            title: '保存失败',
                            icon: "fail",
                            duration: 2000
                        })
                    },
                    complete: function () {
                        // complete
                    }
                })
            }
        })
    },

    deleteClick: function (e) {
        wx.request({
            url: app.globalData.urlPrefix + '/index.php/Xcx/Date/deleteImg',
            data: {
                userid: this.data.userid,
                imgid: this.data.imgid,
            },
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                // success
                console.log(res.data)
                // wx.showToast({
                //     title: '删除成功',
                //     icon: "success",
                //     duration: 2000
                // })
                wx.navigateBack({
                    delta: 1, // 回退前 delta(默认为1) 页面
                })
            },
            fail: function () {
                // wx.showToast({
                //     title: '删除失败',
                //     icon: "success",
                //     duration: 2000
                // })
                // fail
            },
            complete: function () {
                // complete
            }
        })
    }
})