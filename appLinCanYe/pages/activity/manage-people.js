var app = getApp()
Page({
    data: {
        num: 0,
        enrolllist: [],
        enrolllist0: [],
        enrolllist1: [],
        enrolllist2: [],
        enrolllist3: [],
        enrolllist4: [],
        departArray: ['技术部', '产品部', '视觉部', '综合部', '运营部'],
    },
    onLoad: function (options) {
        // 页面初始化 options为页面跳转所带来的参数
        console.log('onLoad')
        this.getDepartPeople()
        this.setData({
            enrolllist: this.data.enrolllist
        })
        console.log(this.data.enrolllist.length)
    },
    //获取该部门的参与人员
    getDepartPeople: function () {
        var list = app.globalData.enrolllist
        this.setData({
            num: list.length
        })
        for (var num in list) {
            var item = list[num]
            console.log("item " + item.department + " " + this.data.departArray[0])
            if (item.department == this.data.departArray[0]) {
                this.data.enrolllist0.push(item)
                console.log("技术部： " + this.data.enrolllist0.length)
            }
            if (item.department == this.data.departArray[1]) {
                this.data.enrolllist1.push(item)
            }
            if (item.department == this.data.departArray[2]) {
                this.data.enrolllist2.push(item)
            }
            if (item.department == this.data.departArray[3]) {
                this.data.enrolllist3.push(item)
            }
            if (item.department == this.data.departArray[4]) {
                this.data.enrolllist4.push(item)
            }
        }
        this.data.enrolllist.push(this.data.enrolllist0)
        this.data.enrolllist.push(this.data.enrolllist1)
        this.data.enrolllist.push(this.data.enrolllist2)
        this.data.enrolllist.push(this.data.enrolllist3)
        this.data.enrolllist.push(this.data.enrolllist4)
    },
})