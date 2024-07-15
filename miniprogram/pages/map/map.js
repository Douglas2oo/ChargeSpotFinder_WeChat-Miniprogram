// map.js
Page({
  data: {
  latitude: 0,
  longitude: 0,
  markers: [],
  scale: 14, // 默认缩放级别
  animationData: {},
  searchQuery: '',
  nearbyStations: [],
  searchResults: [],
  showResults: false,
  },

  onLoad: function() {
  this.setUserLocation();
  },

  onShow: function() {
    // 页面显示时恢复搜索框位置
    const app = getApp();
    this.updateSearchBoxPosition(app.globalData.searchBoxPosition);
  },

  onHide: function() {
    // 页面隐藏时保存搜索框位置
    const app = getApp();
    app.globalData.searchBoxPosition = 'bottom';
    this.setData({
      showResults: false
    });
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
    that.getCity(res.latitude, res.longitude); // 获取城市信息
    },
    fail() {
    wx.showToast({
      title: '无法获取位置信息',
      icon: 'none'
    });
    }
  });
  },

  stationsData: [],

  loadNearbyChargingStations: function() {
  // 假设这里调用了后端API，以下是示例数据
  this.stationsData = [
    { id: 1, latitude: this.data.latitude + 0.001, longitude: this.data.longitude + 0.001, name: '充电站1' },
    { id: 2, latitude: this.data.latitude - 0.001, longitude: this.data.longitude - 0.001, name: '充电站2' },
    { id: 3, latitude: this.data.latitude - 0.003, longitude: this.data.longitude - 0.002, name: '充电站3' },
    // 请继续添加充电站数据
  ];

  console.log('附近的充电站：', this.stationsData);

  const markers = this.stationsData.map(station => ({
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

  searchStations: function(query) {
    // 模拟根据搜索查询获取充电桩数据
    const results = this.stationsData.filter(station => station.name.includes(query));
    this.setData({
      searchResults: results
    });
    console.log('搜索结果：', results);
  },

    // 更新位置信息
    updateLocation: function(e) {
      const { latitude, longitude } = e.detail.centerLocation;
      this.setData({
        latitude,
        longitude
      });
      // 调用逆地理编码获取城市信息
      this.getCity(latitude, longitude);
    },

    
  //     // 调用腾讯位置服务的逆地理编码API获取城市信息
  // getCity: function(latitude, longitude) {
  //   const that = this;
  //   const key = 'YOUR_TENCENT_LOCATION_SERVICE_KEY'; // 替换为你的腾讯位置服务的key
  //   wx.request({
  //     url: `https://apis.map.qq.com/ws/geocoder/v1/?location=${latitude},${longitude}&key=${key}`,
  //     success: function(res) {
  //       if (res.data.status === 0) {
  //         const city = res.data.result.address_component.city;
  //         that.setData({
  //           city: city
  //         });
  //       } else {
  //         console.error('逆地理编码失败：', res.data.message);
  //       }
  //     },
  //     fail: function(error) {
  //       console.error('请求失败：', error);
  //     }
  //   });
  // },

  onFocus: function() {
    // 点击搜索框时，执行动画
    const animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease'
    });

    // 设置动画目标状态为页面顶部
    animation.bottom('85%').step();
    this.setData({
      animationData: animation.export(),
      searchBoxPosition: 'top',
      showResults: true
    });
  },

  updateSearchBoxPosition: function(position) {
    const animation = wx.createAnimation({
      duration: 0,
      timingFunction: 'ease'
    });

    animation.bottom('5%').step();

    this.setData({
      animationData: animation.export(),
      searchBoxPosition: position
    });
  },

  onInput: function(e) {
    const query = e.detail.value;
    this.setData({
      searchQuery: query
    });
    if (query.length > 0) {
      this.searchStations(query);
    } else {
      this.setData({
        searchResults: []
      });
    }
  },

});
