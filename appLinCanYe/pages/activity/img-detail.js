var app = getApp()
Page({
    data: {
        url: '',
        imgid: '',
        canDelete: null
    },

    onLoad: function (option) {
        console.log(option)
        this.setData({
            url: option.url,
            imgid: option.imgid,
            canDelete: option.canDelete,
        })

        console.log("canDelete " + this.data.canDelete)
    },

    saveClick: function (e) {
        wx.downloadFile({
            url: this.data.url,
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
        console.log("imgid " + this.data.imgid)
        app.postApi('/index.php/Xcx/Date/deleteImg', {
            third_session: app.globalData.third_session,
            imgid: this.data.imgid,
        }, function (res) {
            console.log(res)
            // wx.showToast({
            //     title: '删除成功',
            //     icon: "success",
            //     duration: 2000
            // })
            wx.navigateBack({
                delta: 1, // 回退前 delta(默认为1) 页面
            })
        })
    }
})