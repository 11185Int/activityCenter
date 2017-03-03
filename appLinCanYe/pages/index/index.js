//index.js
//获取应用实例
var app = getApp()
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
Page({
    data: {
        userInfo: {},
        tabs: ["发起活动", "参与活动"],
        createList: [],
        joinList: [],
        activeIndex: 0,
        sliderOffset: 0,
        sliderLeft: 0,
        currentMyPage: 1,
        currentEnrollPage: 1,
        loadMyMoreHidden: true,
        loadEnrollMoreHidden: true,
    },

    onLoad: function () {
        console.log('onLoad')
        var that = this

        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
                    sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
                });
            }
        });
        app.globalData.userid = wx.getStorageSync('userid')
    },

    onShow: function () {
        console.log('onShow')
        var that = this
        if (app.globalData.userid) {
            this.getUserInfo(function (res) {
                that.setData({
                    userInfo: res.data.data.myUserinfo,
                })
            }, app.globalData.userid)
            this.getMyActInfo(function (res) {
                that.setData({
                    createList: res.data.data.myAcinfoList,
                })
            }, app.globalData.userid, this.data.currentMyPage, '10')
            this.getEnrollActInfo(function (res) {
                that.setData({
                    joinList: res.data.data.acList
                })
            }, app.globalData.userid, this.data.currentEnrollPage, '10')
        }
    },

    onPullDownRefresh: function () {
        console.log('refresh')
        var that = this
        if (app.globalData.userid) {
            this.getUserInfo(function (res) {
                that.setData({
                    userInfo: res.data.data.myUserinfo,
                })
            }, app.globalData.userid)
            this.getMyActInfo(function (res) {
                that.setData({
                    createList: res.data.data.myAcinfoList
                })
            }, app.globalData.userid, this.data.currentMyPage, '10')
            this.getEnrollActInfo(function (res) {
                that.setData({
                    joinList: res.data.data.acList
                })
            }, app.globalData.userid, this.data.currentEnrollPage, '10')
        }
        wx.stopPullDownRefresh()
    },

    onReachBottom: function () {
        console.log('bottom');
        var that = this;
        if (this.data.activeIndex == 0) {
            if (this.data.loadMyMoreHidden) {
                wx.showToast({
                    title: '拼命加载中',
                    icon: 'loading',
                    duration: 10000,
                });
            }

            this.getMyActInfo(function (res) {
                console.log(res.data);
                if (res.data.status === 1 && res.data.data.myAcinfoList.size > 0) {
                    that.setData({
                        createList: that.data.createList.concat(res.data.data.myAcinfoList),
                        currentMyPage: (that.data.currentMyPage + 1),
                    });
                } else {
                    that.setData({
                        loadMyMoreHidden: false,
                    })
                }
                wx.hideToast();
            }, app.globalData.userid, this.data.currentMyPage, '10')

        } else {
            if (this.data.loadEnrollMoreHidden) {
                wx.showToast({
                    title: '拼命加载中',
                    icon: 'loading',
                    duration: 10000,
                });
            }
            this.getEnrollActInfo(function (res) {
                console.log(res.data);
                if (res.data.status === 1 && res.data.data.acList.size > 0) {
                    that.setData({
                        joinList: that.data.joinList.concat(res.data.data.acList),
                        currentEnrollPage: (that.data.currentEnrollPage + 1),
                    });
                } else {
                    that.setData({
                        loadEnrollMoreHidden: false,
                    })
                }
                wx.hideToast();
            }, app.globalData.userid, this.data.currentEnrollPage, '10')
        }

    },

    //获取用户数据
    getUserInfo: function (cb, userid) {
        var that = this
        console.log('userid' + userid)
        wx.request({
            url: app.globalData.urlPrefix + '/index.php/Xcx/Date/getUserinfo',
            data: {
                userid: userid,
            },
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                console.log(res.data);
                if (res.data.status === 1 && typeof cb == "function") {
                    cb(res)
                }
            },
            fail: function (res) {
                console.log(res.data)
            }
        });
    },

    //获取创建活动数据
    getMyActInfo: function (cb, userid, currentPage, pageSize) {
        var that = this
        console.log('page ' + currentPage)
        wx.request({
            url: app.globalData.urlPrefix + '/index.php/Xcx/Date/myAcinfo',
            data: {
                userid: userid,
                page: currentPage,
                pagesize: pageSize,
            },
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                console.log(res.data);
                if (res.data.status === 1 && typeof cb == "function") {
                    cb(res)
                }
            },
            fail: function (res) {
                console.log(res.data)
            }
        });
    },

    //获取可参与活动数据
    getEnrollActInfo: function (cb, userid, currentPage, pageSize) {
        var that = this
        console.log('page ' + currentPage)
        wx.request({
            url: app.globalData.urlPrefix + '/index.php/Xcx/Date/acList',
            data: {
                userid: userid,
                page: currentPage,
                pagesize: pageSize,
            },
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                console.log(res.data);
                if (typeof cb == "function") {
                    cb(res)
                }
            },
            fail: function (res) {
                console.log(res.data)
            }
        });
    },

    tabClick: function (e) {
        this.setData({
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: e.currentTarget.id
        });
    },

    createClick: function () {
        wx.navigateTo({
            url: '../activity/create-activity'
        })
    },

    manageDetailClick: function (e) {
        app.globalData.acid = e.currentTarget.id
        console.log('acid' + e.currentTarget.id)
        wx.navigateTo({
            url: '../activity/manage-activity'
        })
    },

    joinDetailClick: function (e) {
        console.log(e.currentTarget.id)
        app.globalData.acid = e.currentTarget.id
        console.log("acid " + app.globalData.acid)
        wx.navigateTo({
            url: '../activity/join-activity'
        })
    },

    configClick: function (e) {
        wx.navigateTo({
            url: '/pages/index/signup?' + 'userid=' + this.data.userInfo.userid
            + '&departmemt=' + this.data.userInfo.departmemt
            + '&name=' + this.data.userInfo.name
            + '&mobile=' + this.data.userInfo.mobile
        })
    }
})