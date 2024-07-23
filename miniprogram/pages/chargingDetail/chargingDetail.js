// chargingDetail.js
Page({
  data: {
    stationInfo: null,
    isFavorite: false // 添加一个状态来记录当前站点是否已收藏
  },
  onLoad: function(options) {
    const stationId = parseInt(options.id, 10); // 获取传递过来的参数
    this.loadStationInfo(stationId);
    
    // 加载收藏状态
    this.loadFavoriteStatus(stationId);
  },

  loadStationInfo: function(stationId) {
    const app = getApp();
    const mockData = app.globalData.originalStationData.find(station => station.id === stationId);
    console.log(mockData);
    this.setData({
      stationInfo: mockData
    });
  },

  loadFavoriteStatus: function(stationId) {
    const favorites = wx.getStorageSync('favorites') || [];
    const isFavorite = favorites.some(fav => fav.id === stationId);
    this.setData({ isFavorite });
  },

  // 点击导航按钮
  onNavigateTap: function() {
    console.log('触发导航');
    // wx.navigateTo({
    //   url: '/pages/chargingMap/chargingMap'
    // });
  },

  // 点击收藏按钮
  addFavorite: function() {
    const userInfo = wx.getStorageSync('userInfo'); // 从本地存储中获取用户信息

    if (!userInfo || userInfo.nickName === '未登录') {
      // 用户未登录，弹出登录提示
      wx.showModal({
        title: '提示',
        content: '请先登录',
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/profile/profile' // 假设登录页面路径为 /pages/profile/profile
            });
          }
        }
      });
      return;
    }

    // 用户已登录，处理收藏和取消收藏
    const stationId = this.data.stationInfo.id;
    let favorites = wx.getStorageSync('favorites') || [];
    const isFavorite = this.data.isFavorite;

    if (isFavorite) {
      // 取消收藏
      favorites = favorites.filter(fav => fav.id !== stationId);
      wx.showToast({
        title: '取消收藏',
        icon: 'success'
      });
    } else {
      // 添加收藏
      favorites.push(this.data.stationInfo);
      wx.showToast({
        title: '已收藏',
        icon: 'success'
      });
    }

    wx.setStorageSync('favorites', favorites);
    this.setData({ isFavorite: !isFavorite });
  },

  // 扫码充电
  onScan: function() {
    console.log('扫码充电');
    wx.navigateTo({
      url: '/pages/scan/scan',
    });
  },
});
