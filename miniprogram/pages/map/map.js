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
    searchBoxPosition: 'bottom' // 设置默认值
  },

  onLoad: function() {
    this.setUserLocation();
  },

  onShow: function() {
    // 页面显示时恢复搜索框位置
    const app = getApp();
    const position = app.globalData.searchBoxPosition || 'bottom'; // 确保有默认值
    this.updateSearchBoxPosition(position);
  },

  onHide: function() {
    // 页面隐藏时保存搜索框位置
    const app = getApp();
    app.globalData.searchBoxPosition = this.data.searchBoxPosition;
    this.setData({
      showResults: false
    });
  },

  setUserLocation: function() {
    const that = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              that.getUserLocation();
            },
            fail() {
              wx.showModal({
                title: '位置权限',
                content: '请授权位置信息',
                success(res) {
                  if (res.confirm) {
                    wx.openSetting({
                      success(settingRes) {
                        if (settingRes.authSetting['scope.userLocation']) {
                          that.getUserLocation();
                        }
                      }
                    });
                  }
                }
              });
            }
          });
        } else {
          that.getUserLocation();
        }
      }
    });
  },

  getUserLocation: function() {
    const that = this;
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        });
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

  getCity: function(latitude, longitude) {
    const that = this;
    const key = 'YOUR_TENCENT_LOCATION_SERVICE_KEY'; // 替换为你的腾讯位置服务的key
    wx.request({
      url: `https://apis.map.qq.com/ws/geocoder/v1/?location=${latitude},${longitude}&key=${key}`,
      timeout: 10000, // 设置超时时间为10秒
      success: function(res) {
        if (res.data.status === 0) {
          const city = res.data.result.address_component.city;
          that.setData({
            city: city
          });
        } else {
          console.error('逆地理编码失败：', res.data.message);
        }
      },
      fail: function(error) {
        console.error('请求失败：', error);
        wx.showToast({
          title: '请求失败，请检查网络',
          icon: 'none'
        });
      }
    });
  },

  stationsData: [],

  loadNearbyChargingStations: function() {
    this.stationsData = [
      { id: 1, latitude: this.data.latitude + 0.001, longitude: this.data.longitude + 0.001, name: '充电站1' },
      { id: 2, latitude: this.data.latitude - 0.001, longitude: this.data.longitude - 0.001, name: '充电站2' },
      { id: 3, latitude: this.data.latitude - 0.003, longitude: this.data.longitude - 0.002, name: '充电站3' }
    ];

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
    const results = this.stationsData.filter(station => station.name.includes(query));
    this.setData({
      searchResults: results
    });
  },

  updateLocation: function(e) {
    const { latitude, longitude } = e.detail.centerLocation;
    this.setData({
      latitude,
      longitude
    });
  },

  onFocus: function() {
    const animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease'
    });

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

    animation.bottom(position === 'top' ? '85%' : '5%').step();

    this.setData({
      animationData: animation.export(),
      searchBoxPosition: position || 'bottom' // 确保默认值
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
  }
});
