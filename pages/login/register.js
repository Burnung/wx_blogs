// pages/login/register.js
Page({
  onRoleInput: function(e) {
    this.setData({ role: e.detail.value });
  },
  onPhoneInput: function(e) {
    this.setData({ phone: e.detail.value });
  },

  onPasswordInput: function(e) {
    this.setData({ password: e.detail.value });
  },

  onLogin:function(){
    wx.redirectTo({
      url: '/pages/login/login',
    });
  },

  onConfirmPasswordInput: function(e) {
    this.setData({ confirmPassword: e.detail.value });
  },

  onRegisterSubmit: function() {
    if (this.data.password !== this.data.confirmPassword) {
      wx.showToast({
        title: '两次密码输入不一致',
        icon: 'none'
      });
      return;
    }
    const that = this;
    const app = getApp();
    wx.request({
      url: `${app.globalData.serverUrl}/register`, // 
      method: 'POST',
      data: {
        phone_number: that.data.phone,
        password: that.data.password,
      },
      
      success: function(response) {
        if(response.statusCode == 200){
          const resData = response.data;
          const app = getApp();
          app.globalData.userInfo = resData.user_info;
          app.globalData.token = resData.token;
          wx.setStorageSync('token', app.globalData.token);
          wx.setStorageSync('userInfo', app.globalData.userInfo);
          wx.redirectTo({
            url: '/pages/babyList/babyList',
          });
        }
        else{
          const resData = response.data;
          console.log(`login failed!,msg:${resData.msg}, error:${resData.error}`)
          if(response.statusCode == 500){
            wx.showToast({
              title: resData.msg,
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
  }
});
