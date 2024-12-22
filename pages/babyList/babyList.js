// pages/babyList/babyList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    babyList: null,

  },

  /**
   * 生命周期函数--监听页面加载
   */

  calculateAge(birthDate) {
    const today = new Date();
    const ageInMilliseconds = today - birthDate;
    const ageInDays = Math.floor(ageInMilliseconds / (1000 * 60 * 60 * 24)); // 将年龄转换为天数

    if (ageInDays < 365) { // 如果不到1岁
        const months = Math.floor(ageInDays / 30); // 计算月数
        const days = ageInDays % 30; // 剩余天数

        return `${months}个月 ${days}天`; // 返回格式
    } else {
        let years = today.getFullYear() - birthDate.getFullYear();
        let months = today.getMonth() - birthDate.getMonth();

        if (months < 0) {
            years--; // 如果当前月份小于出生月份，减去一年
            months += 12; // 调整月份
        }

        return `${years}岁 ${months}个月`; // 返回格式
    }
  },
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: '宝宝乐园' // 设置标题
    });
    const app = getApp();
    wx.request({
      url: `${app.globalData.serverUrl}/get_blog_list`, // 
      method: 'POST',
      header: {'content-type': 'application/json',
      'Authorization': app.globalData.token},
      success:(response)=> {
        if(response.statusCode == 200){
          const resData = response.data;
          
          console.log(`get baby List success, baby Count is ${resData.blogs.length}`)
          resData.blogs.forEach(element => {
            const birthDate = new Date(element.baby_infos['bornDate']);
            element.age = this.calculateAge(birthDate);
            console.log(`age is ${element.age}`)
          });
          this.setData({babyList:resData.blogs});
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

  addBaby(){
    console.log('go to add baby');
    wx.redirectTo({
      url: '/pages/addBaby/addBaby',
    });
  },
  onBabyItemClick(event){
    const index = event.currentTarget.dataset.index;
    const selectedBaby = this.data.babyList[index]; // 根据索引获取对应的宝宝信息
    console.log('sel baby is', selectedBaby);
    const selectedBabyStr = JSON.stringify(selectedBaby);
    wx.navigateTo({
      url: `/pages/friendsCirle/friendsCirle?babyData=${encodeURIComponent(selectedBabyStr)}`
    });
  }
})