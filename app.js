//app.js
App({
  onLaunch: function () {
    //获取token
    const token = wx.getStorageSync('token');
    // const user_info = wx.getStorageSync('userInfo');
    
    if(token){
      this.globalData.token = token;
      this.verfyToken(token);
    }
    else{
      wx.redirectTo({
        url: '/pages/login/login',
      });
    }
  },
  verfyToken: function(token){
    wx.request({
      url: `${this.globalData.serverUrl}/verifyToken`,
      method: 'POST',
      data: {},
      header: {'content-type': 'application/json',
      'Authorization': token},
      success:(res) =>{
        if(res.statusCode == 200){
          const resData = res.data;
          wx.setStorageSync('userInfo', resData.userInfo);
          console.log('token is valid!!');
          if(resData.new_token !== undefined){
            this.globalData.token = resData.new_token;
            wx.setStorageSync('token', resData.new_token);
            console.log('update token!')
          }
          wx.redirectTo({
            url: '/pages/babyList/babyList',
          });
        }
        else{
            console.log('server error: ${res.statusCode}');
            wx.redirectTo({
              url: '/pages/login/login',
            });
        }
      },
      fail(error){
        console.log('server error: ${res.statusCode}');
        wx.redirectTo({
          url: '/pages/login/login',
        });
      }
    })
  },
  globalData: {
    userInfo: null,
    serverUrl: "https://chongchong.online/chong_blogs",
    token: null
  }
})