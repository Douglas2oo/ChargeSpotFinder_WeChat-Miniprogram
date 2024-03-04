// chargingDetail.js
Page({
  data: {
  // 页面的初始数据
  stationInfo: null
  },
  onLoad: function(options) {
  const stationId = options.id; // 获取传递过来的参数
  this.loadStationInfo(stationId);
  },
  loadStationInfo: function(stationId) {
  // 模拟从后端获取数据
  // 实际应用中，你需要发送网络请求到你的服务器
  // 这里使用假数据来模拟
  const mockData = {
    id: stationId,
    name: '亿电邦科充电站',
    location: '云升科学园',
    price: '0.85元/度',
    distance: '1.4km',
    averageTime: '2小时',
    costPerHour: '0.17元/分钟'
  };
  this.setData({
    stationInfo: mockData
  });
  }
});
