// map.js
Page({
  data: {
  latitude: 0,
  longitude: 0,
  markers: [],
  scale: 14, // 默认缩放级别
  },

  onLoad: function() {
  this.setUserLocation();
  },

  setUserLocation: function() {
  const that = this;
  // 获取用户的当前位置
  wx.getLocation({
    type: 'wgs84',
    success(res) {
    that.setData({
      latitude: res.latitude,
      longitude: res.longitude
    });
    // 设置位置成功后，加载附近的充电站
    that.loadNearbyChargingStations();
    },
    fail() {
    wx.showToast({
      title: '无法获取位置信息',
      icon: 'none'
    });
    }
  });
  },

  loadNearbyChargingStations: function() {
  // 假设这里调用了后端API，以下是示例数据
  const stationsData = [
    { id: 1, latitude: this.data.latitude + 0.001, longitude: this.data.longitude + 0.001, name: '充电站1' },
    { id: 2, latitude: this.data.latitude - 0.001, longitude: this.data.longitude - 0.001, name: '充电站2' },
    { id: 3, latitude: this.data.latitude - 0.003, longitude: this.data.longitude - 0.002, name: '充电站3' },
    // 请继续添加充电站数据
  ];

  const markers = stationsData.map(station => ({
    id: station.id,
    latitude: station.latitude,
    longitude: station.longitude,
    iconPath: '/images/location.jpg', // 替换为充电站标记图标的路径
    width: 30,
    height: 30
  }));

  this.setData({
    markers: markers
  });
  },
});
