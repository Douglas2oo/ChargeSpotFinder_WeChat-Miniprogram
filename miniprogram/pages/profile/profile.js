//profile.js
Page({
  data: {
  phoneNumber:null,
  userInfo: {
    avatarUrl: '/images/初始头像.webp',
    nickName: '未登录'
  },
  animationData: {}, // 初始化动画数据
  menuAnimation: {} // 菜单项动画数据
  
  },
  
  // 页面加载时
  onLoad: function() {
  this.createFadeAnimation();
  this.createSlideAnimation();
  },

  // 创建淡入动画
  createFadeAnimation: function() {
  let animation = wx.createAnimation({
    duration: 1000,
    timingFunction: 'ease',
  });

  animation.opacity(0).step({duration: 0}).opacity(1).step();

  this.setData({
    animationData: animation.export()
  });
  },
  

  // 创建滑动动画
  createSlideAnimation: function() {
  let animation = wx.createAnimation({
    duration: 1000,
    timingFunction: 'ease',
  });

  animation.translateX(-100).step({duration: 0}).translateX(0).step();

  this.setData({
    menuAnimation: animation.export()
  });
  },

    //获取手机号
    getPhoneNumber: function(e) {
      this.onAvatarTap(); // 执行额外的逻辑
      if (e.detail.errMsg === 'getPhoneNumber:ok') {
        console.log('手机号码', e.detail.encryptedData);
        wx.showToast({
          title: '手机号授权成功',
          icon: 'success'
        });
        this.setData({
          isPhoneBound: true // 设置手机号绑定状态为true
        });
      } else {
        wx.showToast({
          title: '无法获取手机号',
          icon: 'none'
        });
      }
    },
    

  bindPhoneNumber: function() {
    wx.getPhoneNumber({
      success: (res) => {
        if (res.errMsg === 'getPhoneNumber:ok') {
          // 用户同意授权
          this.getPhoneNumber(res); // 传递事件对象
        } else {
          // 用户拒绝授权
          wx.showToast({
            title: '无法获取手机号',
            icon: 'none'
          });
        }
      }
    });
  },
  

  // 获取用户信息
  getUser() {
    wx.showModal({
      title: '登录',
      content: '登录后可以享受更多服务',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({ title: '正在登录...' });
          wx.getUserProfile({
            desc: '用于完善个人资料',
            success: (res) => {
              console.log('获取用户信息成功', res);
              this.setData({ userInfo: res.userInfo });
              wx.setStorageSync('userInfo', res.userInfo);
              wx.showToast({ title: '登录成功', icon: 'success', duration: 2000 });
            },
            fail: (err) => {
              console.error('获取用户信息失败', err);
              wx.showToast({ title: '登录失败', icon: 'error', duration: 2000 });
            },
            complete: () => wx.hideLoading()
          });
        } else if (res.cancel) {
          console.log('用户取消登录');
          wx.showToast({ title: '取消登录', icon: 'none', duration: 2000 });
        }
      }
    });
  },
  
  // 在这里插入 onAvatarTap 方法
  onAvatarTap: function() {
    // 检查用户是否已登录
    if (this.data.userInfo.nickName === '未登录') {
      // 用户未登录，调用getUser方法以引导用户登录
      this.getUser();
    }
  },

  // 生命周期函数--监听页面加载
  onLoad() {
  const userInfo = wx.getStorageSync('userInfo');
  if (userInfo) {
    this.setData({ userInfo });
  }
  },

  // 生命周期函数--监听页面初次渲染完成
  onReady() {
  // 页面渲染完成的回调
  console.log('页面初次渲染完成');
  },

  // 生命周期函数--监听页面显示
  onShow() {
  wx.hideHomeButton();
  wx.hideShareMenu();
  },

  // 生命周期函数--监听页面隐藏
  onHide() {
  // 页面隐藏时的处理逻辑
  console.log('页面隐藏');
  },

  // 生命周期函数--监听页面卸载
  onUnload() {
  // 页面卸载时的处理逻辑
  console.log('页面卸载');
  },

  // 页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh() {
    // 用户下拉刷新时的处理逻辑
    console.log('用户下拉刷新');
    // 例如，刷新用户信息
    this.onAvatarTap(); // 假设这里调用获取用户信息的方法
    wx.stopPullDownRefresh(); // 停止下拉刷新动画
    },

  // 页面上拉触底事件的处理函数
  onReachBottom() {
  // 用户上拉触底时的处理逻辑
  console.log('页面上拉触底');
  // 可以加载更多内容或显示提示信息
  },

  // 用户点击右上角分享
  onShareAppMessage() {
  // 设置分享内容
  return {
    title: '我的个人主页',
    path: '/page/user?id=123' // 示例路径，根据实际情况修改
  };
  },

  // 退出登录
  logout() {
    // 首先检查用户是否已登录
    if (this.data.userInfo.nickName === '未登录') {
    // 如果用户未登录，则不弹出退出登录的确认对话框，直接返回或显示提示
    wx.showToast({ title: '您当前未登录', icon: 'none', duration: 2000 });
    } else {
    // 用户已登录，弹出确认对话框
    wx.showModal({
      title: '退出登录',
      content: '确定退出登录吗？',
      success: (res) => {
      if (res.confirm) {
        console.log('用户点击确定');
        wx.removeStorageSync('userInfo');
        this.setData({
        userInfo: { avatarUrl: '/images/初始头像.webp', nickName: '未登录' }
        });
        wx.showToast({ title: '已退出登录', icon: 'success', duration: 2000 });
      } else if (res.cancel) {
        console.log('用户点击取消');
      }
      }
    });
    }
  },
  goToFavorites: function() {
    wx.navigateTo({
      url: '/pages/favorites/favorites' // 跳转到“我的收藏”页面
    });
  }
})
