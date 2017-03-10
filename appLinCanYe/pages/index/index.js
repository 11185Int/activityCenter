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
    },

    onShow: function () {
        console.log('onShow')
        var that = this
        if (app.globalData.third_session) {
            this.getUserInfo()
            this.getMyActInfo(function (res) {
                console.log("get " + res)
                that.setData({
                    createList: res.data.myAcinfoList,
                })
            })
            this.getEnrollActInfo(function (res) {
                console.log("get " + res)
                that.setData({
                    joinList: res.data.acList
                })
            })
        }
    },

    onPullDownRefresh: function () {
        console.log('refresh')
        var that = this
        if (app.globalData.userid) {
            this.getUserInfo()
            this.getMyActInfo(function (res) {
                console.log("get " + res)
                that.setData({
                    createList: res.data.myAcinfoList,
                })
            })
            this.getEnrollActInfo(function (res) {
                console.log("get " + res)
                that.setData({
                    joinList: res.data.acList
                })
            })
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
            })

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
            })
        }

    },

    //获取用户数据
    getUserInfo: function () {
        console.log("getInfo " + app.globalData.third_session)
        var that = this
        app.postApi('/index.php/Xcx/Date/getUserinfo', {
            third_session: app.globalData.third_session
        }, function (res) {
            console.log("get " + res)
            that.setData({
                userInfo: res.data.myUserinfo,
            })
        })
    },

    //获取创建活动数据
    getMyActInfo: function (cb) {
        var that = this
        app.postApi('/index.php/Xcx/Date/myAcinfo', {
            third_session: app.globalData.third_session,
            page: this.data.currentMyPage,
            pagesize: '10',
        }, cb)
    },

    //获取可参与活动数据
    getEnrollActInfo: function (cb) {
        var that = this
        app.postApi('/index.php/Xcx/Date/acList', {
            third_session: app.globalData.third_session,
            page: this.data.currentEnrollPage,
            pagesize: '10',
        }, cb)
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
        console.log('acid' + e.currentTarget.id)
        wx.navigateTo({
            url: '../activity/manage-activity?acid=' + e.currentTarget.id
        })
    },

    joinDetailClick: function (e) {
        console.log("acid " + e.currentTarget.id)
        wx.navigateTo({
            url: '../activity/join-activity?acid='+ e.currentTarget.id
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