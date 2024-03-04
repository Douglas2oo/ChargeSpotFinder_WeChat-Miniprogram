Page({
  data: {
  },

  onLoad: function() {
  },

  loadMarkers: function() {
  // 示例：假设这是从后端获取的充电桩位置数据
  const chargingPoles = [
    { id: 1, latitude: 23.160103, longitude: 113.444197, name: '亿电邦科充电桩1', iconPath: '/images/location.jpg', width: 50, height: 50 },
    { id: 2, latitude: 30.652, longitude: 104.062, name: '充电桩2', iconPath: '/images/location.jpg', width: 50, height: 50 },
    // 可以添加更多充电桩信息
  ];

  const markers = chargingPoles.map(pole => ({
    id: pole.id,
    latitude: pole.latitude,
    longitude: pole.longitude,
    name: pole.name,
    iconPath: pole.iconPath, // 确保图片路径正确
    width: pole.width,
    height: pole.height
  }));

  this.setData({ markers });
  },

  handleMarkerTap: function(e) {
  // 处理标记点的点击事件
  const markerId = e.markerId;
  const marker = this.data.markers.find(marker => marker.id === markerId);
  if (marker) {
    wx.navigateTo({
    url: `/pages/chargingDetail/chargingDetail?id=${markerId}` // 根据实际需求修改 URL
    });
  }
  },

  navigateToDetail: function(event) {
  // 此函数用于处理非标记点的其他导航逻辑，如果有的话
  wx.navigateTo({
    url: `/pages/chargingDetail/chargingDetail` // 根据实际需求修改 URL
  });
  }
});
