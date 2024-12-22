// pages/login/login.js
Page({
  data: {
    phone: '',
    password: ''
  },
  
  onPhoneInput: function(e) {
    this.setData({ phone: e.detail.value });
  },

  onPasswordInput: function(e) {
    this.setData({ password: e.detail.value });
  },

  onLogin: function() {
    const that = this;
    const app = getApp();
    wx.request({
      url: `${app.globalData.serverUrl}/login`, // 替换为你的登录接口URL
      method: 'POST',
      data: {
        phone_number: that.data.phone,
        password: that.data.password,
      },
      success: function(response) {
        if(response.statusCode == 200){
          const resData = response.data;
          const app = getApp();
          app.globalData.userInfo = resData.userInfo;
          app.globalData.token = resData.token;
          wx.setStorageSync('token', app.globalData.token);
          wx.setStorageSync('userInfo', app.globalData.userInfo);
          wx.redirectTo({
            url: '/pages/babyList/babyList',
          });
        }
        else{
          const resData = response.data;
          console.log('login failed!,msg:${resData.msg}, error:${resData.error}')
          if(response.statusCode == 500){
            wx.showToast({
              title: '账号/密码不匹配，请重新输入或注册账号！',
              icon: 'error',
              duration:2000
            })
          }
        }
        
      },
      fail: function() {
        // 处理登录失败逻辑
        console.log('登录失败');
      }
    });
  },

  onRegister: function() {
    // 跳转到注册页面或执行注册逻辑
    wx.navigateTo({
      url: '/pages/login/register'
    });
  }
});
