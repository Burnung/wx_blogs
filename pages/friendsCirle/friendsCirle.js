// pages/friendsCirle/friendsCirle.js
const app = getApp()  //获取小程序实例
function getAllData(self){
    wx.request({
        url: app.globalData.baseUrl + "api",
        method: "POST",
        success(res) {
            self.setData({
                deliverData: res.data.result
            })
        }
    })
}
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        deliverData: {},
        showZanAndPinglunNum: null,
        isShowOrHideComtent: false,
        allOrPart: "全文",
        
        // 后边才是咱自己的数据
        babyInfo: {},
    },
    // 点击头部相册图标,打开发朋友圈编辑页面
    showEditPage() {
        wx.navigateTo({
            url: '../edit/edit'
        })
    },
    //朋友圈正文内容显示或收起,逻辑是通过style动态设置max-height样式
    ShowOrHideComtent(){
        if (this.data.allOrPart === "全文"){
            this.setData({
                isShowOrHideComtent: true,
                allOrPart: "收起"
            })
        } else if (this.data.allOrPart === "收起"){
            this.setData({
                isShowOrHideComtent: false,
                allOrPart: "全文"
            })
        }
    },
    //点击朋友圈图片,弹出框预览大图
    showImg(e){
        let outidx = e.currentTarget.dataset.outidx;
        let imgidx = e.target.dataset.imgidx;
        let imgArr = this.data.deliverData[outidx].imgArr;
        wx.previewImage({
            current: imgArr[imgidx], // 当前显示图片的http链接
            urls: imgArr // 需要预览的图片http链接列表
        })
    },
    //点击评论图标,显示点赞和评论按钮
    showZanAndPinglun(e){
        this.setData({
            showZanAndPinglunNum: e.currentTarget.dataset.idx
        })
    },
    //点选和评论的隐藏通过事件委托到全页面(暂时只实现当条朋友所在区域,全页面和滚动时也隐藏在考虑实现)
    hideZanAndPinglun(){
        this.setData({
            showZanAndPinglunNum: null
        })
    },
    //点赞
    dianzan(e){
        this.setData({ showZanAndPinglunNum:null})
        let idx = e.currentTarget.dataset.idx;
        let nickName = app.globalData.userInfo.nickName;
        wx.request({
            url: app.globalData.baseUrl + "zan",
            method: "POST",
            data: {
                idx,
                nickName
            }
        });
        getAllData(this);
    },
  /**
   * 生命周期函数--监听页面加载
   */
    onLoad: function (options) {
      const babyDataStr = options.babyData;
      const babyData = JSON.parse(decodeURIComponent(babyDataStr));

      this.setData({babyInfo:babyData});
      console.log(`get baby data string ${decodeURIComponent(babyDataStr)}`)
      console.log(`get baby data ${babyData['uuid']}`)
      const app = getApp();
      wx.request({
        url: `${app.globalData.serverUrl}/querry_blogs`, // 
        method: 'POST',
        header: {'content-type': 'application/json',
        'Authorization': app.globalData.token},
        data: {
          offset: 0,
          ncount: 10,
          table_uuid: babyData['uuid']
        },
        success:(response)=> {
          if(response.statusCode == 200){
            const resData = response.data;
            console.log(`get blogs List success, blogs total Count is ${resData.total_count}`)
            // this.setData({babyList:resData.blogs});
          }
          else{
            const resData = response.data;
            console.log(`msg:${resData.msg}, error:${resData.error}`)
          }
        },
        fail:() => {
          // 处理登录失败逻辑
          console.log('获取blogs失败');
        }
      });
        //如果朋友圈页面显示，则向服务器发送请求所有数据。
        // if (this.data.hasUserInfo && this.data.canIUse){
        //     console.log(1)
        //     getAllData(this);
        // }
    },
    //首次使用点击按钮获取用户头像和昵称授权
    tapBtnToGetUserInfo: function (e) {
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        getAllData(this);
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () { //下拉刷新数据
        // getAllData();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})