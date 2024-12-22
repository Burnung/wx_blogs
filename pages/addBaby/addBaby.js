// pages/addBaby/addBaby.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bornDate: '',
    babyName: '',
    role: '',
    selectedGender: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  bindDateChange: function (e) {
    this.setData({
      bornDate: e.detail.value // 更新日期
    });
  },
  onNameInput(e){
    this.setData({ babyName: e.detail.value });
  },
  
  onRoleInput(e){
    this.setData({ role: e.detail.value });
    console.log('gender is', this.data.role)
  },

  selectGenderFunc: function (e) {
    const gender = e.currentTarget.dataset.gender; // 获取选中的性别
    this.setData({
      selectedGender: gender // 更新选中的性别
    });
    console.log('gender is', this.data.selectedGender)
  },
  onNext(){
    const {bornDate, babyName, role, selectedGender} = this.data;
    const app = getApp();
    if(!bornDate){
      wx.showToast({
        title: '请输入宝宝的生日',
        icon: 'none'
      });
      return;
    }
    if(!babyName){
      wx.showToast({
        title: '请输入宝宝的小名',
        icon: 'none'
      });
      return;
    }
    if(!role){
      wx.showToast({
        title: '请输入亲子关系',
        icon: 'none'
      });
      return;
    }

    if(!selectedGender){
      wx.showToast({
        title: '请选择宝宝性别',
        icon: 'none'
      });
      return;
    }
    wx.request({
      url: `${app.globalData.serverUrl}/create_blogs_table`, // 
      method: 'POST',
      header: {'content-type': 'application/json',
      'Authorization': app.globalData.token},
      data: {
        gender: selectedGender,
        creater_role: role,
        baby_name: babyName,
        baby_infos:{
          babyName: babyName,
          bornDate: bornDate,
          gender: selectedGender,
        }
      },
      success: function(response) {
        if(response.statusCode == 200){
          const resData = response.data;
          console.log('msg:${resData.msg}, uuid:${resData.blog_table}')
          wx.redirectTo({
            url: '/pages/babyList/babyList',
          });
        }
        else{
          const resData = response.data;
          console.log(`msg:${resData.msg}, error:${resData.error}`)
        }
      },
      fail: function() {
        // 处理登录失败逻辑
        console.log('添加失败');
      }
    });
  }
})