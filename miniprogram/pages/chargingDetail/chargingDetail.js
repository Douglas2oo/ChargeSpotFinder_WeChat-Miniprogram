// chargingDetail.js
Page({
  data: {
  // 页面的初始数据
  stationInfo: null
  },
  onLoad: function(options) {
    const stationId = parseInt(options.id, 10); // 获取传递过来的参数
    this.loadStationInfo(stationId);
  },

  loadStationInfo: function(stationId) {
    const app =  getApp();
    const mockData = app.globalData.originalStationData.find(station => station.id === stationId);
    console.log(mockData);
    this.setData({
      stationInfo: mockData
    });
  },

  // 点击导航按钮---------------------------------------------------------
  onNavigateTap: function() {
    console.log('触发导航');
    // wx.navigateTo({
    //   url: '/pages/chargingMap/chargingMap'
    // });
  },
  //---------------------------------------------------------------------
  // 点击收藏按钮---------------------------------------------------------
  addFavorite: function() {
    console.log('添加收藏');
  },
  //---------------------------------------------------------------------
  // 扫码充电------------------------------------------------------------
  onScan: function() {
    console.log('扫码充电');
    wx.navigateTo({
      url: '/pages/scan/scan',
  });
  },
  //---------------------------------------------------------------------
});
