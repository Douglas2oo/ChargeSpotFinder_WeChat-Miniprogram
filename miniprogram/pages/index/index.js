Page({
  data: {
  latitude: 0,
  longitude: 0,
  markers: [],
  fullScreenMap: false // 用于控制地图是否全屏显示的变量
  },
  onLoad: function() {
  // 获取当前位置
  const that = this;
  wx.getLocation({
    type: 'wgs84',
    success: function(res) {
    that.setData({
      latitude: res.latitude,
      longitude: res.longitude
    });
    // 加载地图标记
    that.loadMarkers();
    },
    fail: function() {
    wx.showToast({
      title: '获取位置信息失败',
      icon: 'none'
    });
    }
  });
  },
  loadMarkers: function() {
  // 这里添加从后端获取的充电桩位置数据
  const chargingPoles = this.getChargingPoles(); // 假设这是一个获取数据的函数
  this.setData({ markers: this.createMarkers(chargingPoles) });
  },
  getChargingPoles: function() {
  // 从后端获取充电桩数据
  // 假设有一个API可以调用，此处为函数的伪代码表示
  wx.request({
    url: ' /api-service/api/getStationGunList/{stationId}',
    method: 'GET',
    success: (res) => {
    return res.data; // 返回的数据应该是充电桩的数组
    },
    fail: () => {
    wx.showToast({
      title: '加载充电桩数据失败',
      icon: 'none'
    });
    return []; // 获取失败则返回空数组
    }
  });
  },
  createMarkers: function(chargingPoles) {
  // 将充电桩数据转换为地图标记
  return chargingPoles.map(pole => ({
    id: pole.id,
    latitude: pole.latitude,
    longitude: pole.longitude,
    name: pole.name,
    iconPath: pole.iconPath,
    width: 50,
    height: 50
  }));
  },
  handleMarkerTap: function(e) {
  // 处理标记点的点击事件
  const markerId = e.markerId;
  const marker = this.data.markers.find(m => m.id === markerId);
  if (marker) {
    wx.navigateTo({
    url: `/pages/chargingDetail/chargingDetail?id=${markerId}` // 修改URL以适应实际页面路径
    });
  }
  },
  toggleFullScreen: function() {
  // 切换地图的全屏状态
  this.setData({
    fullScreenMap: !this.data.fullScreenMap
  });
  },
  navigateToDetail: function(event) {
  // 根据event中的信息来确定需要导航到的详细页面
  const id = event.currentTarget.dataset.id; // 假设按钮上绑定了id
  wx.navigateTo({
    url: `/pages/chargingDetail/chargingDetail?id=${id}` // 修改URL以适应实际页面路径
  });
  }
});
