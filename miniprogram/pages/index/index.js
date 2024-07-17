Page({
  data: {
    chargingStations: [],
    searchQuery: '',
    originalChargingStations: [],
    filteredStations: [],
    tagFiltered: [],
    displayCount: 20, // 初始显示的数量
    totalStations: 0, // 原始数据的总数量
    allLoaded: false, // 是否已加载完所有数据
    searching: false,
    activeButton: '',
    tagType: [],
  },

  onLoad: function() {
    this.loadMarkers();
  },

  onShow: function() {
    this.setData({
      displayCount: 20,
      chargingStations: this.data.originalChargingStations.slice(0, 20),
      totalStations: 20,
      allLoaded: false,
      searching: false,
      activeButton: '',
      searchQuery: '',
    })
  },

  ifShowAllAlready: function() {
    if (this.data.chargingStations.length < 20) {
      this.setData({
        allLoaded: true
      });
    }
  },

// 加载更多功能---------------------------------------------
  loadMoreStations: function() {
    const newDisplayCount = this.data.displayCount + 10;
    if (newDisplayCount >= this.data.totalStations) {
      this.setData({
        allLoaded: true
      });
    }
    if (this.data.searching) {
      this.setData({
        chargingStations: this.data.filteredStations.slice(0, newDisplayCount),
        displayCount: newDisplayCount
      });
    } 
    // else if () {

    // }
     else {
    this.setData({
      chargingStations: this.data.originalChargingStations.slice(0, newDisplayCount),
      displayCount: newDisplayCount
    });
  }
  },
// --------------------------------------------------------

// 标签筛选功能----------------·---------------------------
  tagSort: function(e) {
    const feature = e.currentTarget.dataset.feature;
    this.filterStationsByFeature(feature);
    if (this.data.tagType.includes(feature)) {
      const newTagType = this.data.tagType.filter(tag => tag !== feature);
      this.setData({
        tagType: newTagType,
        displayCount: 20,
      });
    } else {
      this.setData({
        tagType: [...this.data.tagType, feature],
        displayCount: 20,
      })
    }
    console.log(this.data.tagType);
    console.log(this.data.tagType.includes('SuperCharge'));
  },

  // 筛选函数
  filterStationsByFeature: function(feature) {
    if (this.data.searching) {
      const filtered = this.data.filteredStations.filter(station => {
        switch (feature) {
          case 'SuperCharge':
            return station.state && station.state.SuperCharge && station.state.SuperCharge.available > 0;
          case 'Restroom':
            return station.Faculty === 'Restroom';
          case 'Parking':
            return station.Parking === true;
          case 'onLand':
            return station.onLand === true;
          default:
            return false;
        }
      });
      this.setData({
        filteredStations: filtered,
        chargingStations: filtered.slice(0, 20),
      })
    } else {
      const filtered = this.data.originalChargingStations.filter(station => {
      switch (feature) {
        case 'SuperCharge':
          return station.state && station.state.SuperCharge && station.state.SuperCharge.total > 0;
        case 'Restroom':
          return station.Faculty === 'Restroom';
        case 'Parking':
          return station.Parking === true;
        case 'onLand':
          return station.onLand === true;
        default:
          return false;
      }
    });
    }
    this.ifShowAllAlready();
    // this.setData({
    //   chargingStations: filtered.slice(0, this.data.displayCount),
    //   tagType: feature,
    //   displayCount: 20,
    // });
  },
// --------------------------------------------------------

// 搜索功能--------------------------------------------------
  onSearchInput: function(e) {
    this.setData({
      searchQuery: e.detail.value,
      displayCount: 20,
      totalStations: 20,
      allLoaded: false,
      activeButton: '',
    });
    this.filterStations();
  },

  filterStations: function() {
    const query = this.data.searchQuery.toLowerCase();
    const filteredStations = this.data.originalChargingStations.filter(station => {
      return station.name.toLowerCase().includes(query);
    });
    this.setData({
      filteredStations: filteredStations,
      searching: true,
      chargingStations: filteredStations.slice(0, 20)
    });
    this.ifShowAllAlready();
  },
  // --------------------------------------------------------

  // 排序功能--------------------------------------------------
  sortStations: function(e) {
    const type = e.currentTarget.dataset.type;
    let sortedStations = [...this.data.chargingStations];

    if (type === 'price') {
      sortedStations.sort((a, b) => parseFloat(a.price.replace('¥', '')) - parseFloat(b.price.replace('¥', '')));
      this.setData({
        activeButton: 'price'
      });
    } else if (type === 'distance') {
      sortedStations.sort((a, b) => parseFloat(a.distance.replace('km', '')) - parseFloat(b.distance.replace('km', '')));
      this.setData({
        activeButton: 'distance'
      });
    } else if (type === 'speed') {
      sortedStations.sort((a, b) => b.speed - a.speed);
      this.setData({
        activeButton: 'speed'
      });
    }

    this.setData({
      chargingStations: sortedStations
    });
  },
  // --------------------------------------------------------

  navigateToDetail_id: function(event) {
    const { id } = event.currentTarget.dataset;
    // 跳转到详情页并传递充电桩的ID
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`
    });
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
  },

  loadMarkers: function() {
    // 示例：假设这是从后端获取的充电桩位置数据
    const stationsData = [
      {
        id: 1,
        name: "亿电邦科充电桩",
        price: "¥0.85/度",
        distance: "1.4km",
        discountInfo: "优惠信息",
        averageChargeTime: "平均充电2小时",
        chargePerMinute: "每次充电0.17元/分钟",
        speed: 5, // 充电速度
        onLand: true,
        Faculty: 'Restroom',
        Parking: true,
        state: {
          SuperCharge: {
            available: 5,
            total: 10
          },
          NormalCharge: {
            available: 10,
            total: 20
        }
      }
      },
      {
        id: 2,
        name: "超级电充电桩",
        price: "¥1.00/度",
        distance: "0.5km",
        discountInfo: "无优惠",
        averageChargeTime: "平均充电1.5小时",
        chargePerMinute: "每次充电0.20元/分钟",
        speed: 10, // 充电速度
      },
      {
        id: 3,
        name: "亿电邦科充电桩",
        price: "¥0.85/度",
        distance: "1.4km",
        discountInfo: "优惠信息",
        averageChargeTime: "平均充电2小时",
        chargePerMinute: "每次充电0.17元/分钟",
        speed: 20, // 充电速度
      },
      {
        id: 4,
        name: "超级电充电桩",
        price: "¥1.00/度",
        distance: "0.5km",
        discountInfo: "无优惠",
        averageChargeTime: "平均充电1.5小时",
        chargePerMinute: "每次充电0.20元/分钟",
        speed: 10, // 充电速度
      },
      {
        id: 5,
        name: "亿电邦科充电桩",
        price: "¥0.85/度",
        distance: "1.0km",
        discountInfo: "优惠信息",
        averageChargeTime: "平均充电2小时",
        chargePerMinute: "每次充电0.17元/分钟",
        speed: 5, // 充电速度
      },
      {
        id: 6,
        name: "超级电充电桩",
        price: "¥1.00/度",
        distance: "0.5km",
        discountInfo: "无优惠",
        averageChargeTime: "平均充电1.5小时",
        chargePerMinute: "每次充电0.20元/分钟",
        speed: 10, // 充电速度
      },
      {
        id: 7,
        name: "亿电邦科充电桩",
        price: "¥0.85/度",
        distance: "1.4km",
        discountInfo: "优惠信息",
        averageChargeTime: "平均充电2小时",
        chargePerMinute: "每次充电0.17元/分钟",
        speed: 5, // 充电速度
      },
      {
        id: 8,
        name: "超级电充电桩",
        price: "¥1.00/度",
        distance: "0.5km",
        discountInfo: "无优惠",
        averageChargeTime: "平均充电1.5小时",
        chargePerMinute: "每次充电0.20元/分钟",
        speed: 10, // 充电速度
      },
      {
        id: 9,
        name: "亿电邦科充电桩",
        price: "¥0.85/度",
        distance: "1.4km",
        discountInfo: "优惠信息",
        averageChargeTime: "平均充电2小时",
        chargePerMinute: "每次充电0.17元/分钟",
        speed: 5, // 充电速度
      },
      {
        id: 10,
        name: "超级电充电桩",
        price: "¥1.00/度",
        distance: "0.5km",
        discountInfo: "无优惠",
        averageChargeTime: "平均充电2小时",
        chargePerMinute: "每次充电0.17元/分钟",
        speed: 5, // 充电速度
      },
      {
        id: 11,
        name: "亿电邦科充电桩",
        price: "¥0.85/度",
        distance: "1.4km",
        discountInfo: "优惠信息",
        averageChargeTime: "平均充电2小时",
        chargePerMinute: "每次充电0.17元/分钟",
        speed: 5, // 充电速度
        onLand: true,
        Faculty: 'Restroom',
        Parking: true,
        state: {
          SuperCharge: {
            available: 5,
            total: 10
          },
          NormalCharge: {
            available: 10,
            total: 20
        }
      }
      },//给我更多相关数据
      {
        id: 12,
        name: "超级电充电桩",
        price: "¥1.00/度",
        distance: "0.5km",
        discountInfo: "无优惠",
        averageChargeTime: "平均充电1.5小时",
        chargePerMinute: "每次充电0.20元/分钟",
        speed: 10, // 充电速度
      },
      {
        id: 13,
        name: "亿电邦科充电桩",
        price: "¥0.85/度",
        distance: "1.4km",
        discountInfo: "优惠信息",
        averageChargeTime: "平均充电2小时",
        chargePerMinute: "每次充电0.17元/分钟",
        speed: 5, // 充电速度
      },
      {
        id: 14,
        name: "超级电充电桩",
        price: "¥1.00/度",
        distance: "0.5km",
        discountInfo: "无优惠",
        averageChargeTime: "平均充电1.5小时",
        chargePerMinute: "每次充电0.20元/分钟",
        speed: 10, // 充电速度
      },
      {
        id: 15,
        name: "亿电邦科充电桩",
        price: "¥0.85/度",
        distance: "1.4km",
        discountInfo: "优惠信息",
        averageChargeTime: "平均充电2小时",
        chargePerMinute: "每次充电0.17元/分钟",
        speed: 5, // 充电速度
        state: {
          SuperCharge: {
            available: 5,
            total: 10
          },
          NormalCharge: {
            available: 10,
            total: 20
        }
      }},
      {
        id: 16,
        name: "超级电充电桩",
        price: "¥1.00/度",
        distance: "0.5km",
        discountInfo: "无优惠",
        averageChargeTime: "平均充电1.5小时",
        chargePerMinute: "每次充电0.20元/分钟",
        speed: 10, // 充电速度
      },
      {
        id: 17,
        name: "亿电邦科充电桩",
        price: "¥0.85/度",
        distance: "1.4km",
        discountInfo: "优惠信息",
        averageChargeTime: "平均充电2小时",
        chargePerMinute: "每次充电0.17元/分钟",
        speed: 5, // 充电速度
      },
      {
        id: 18,
        name: "超级电充电桩",
        price: "¥1.00/度",
        distance: "0.5km",
        discountInfo: "无优惠",
        averageChargeTime: "平均充电1.5小时",
        chargePerMinute: "每次充电0.20元/分钟",
        speed: 10, // 充电速度
      },
      {
        id: 19,
        name: "亿电邦科充电桩",
        price: "¥0.85/度",
        distance: "1.4km",
        discountInfo: "优惠信息",
        averageChargeTime: "平均充电2小时",
        chargePerMinute: "每次充电0.17元/分钟",
        speed: 5, // 充电速度
      },
      {
        id: 20,
        name: "超级电充电桩",
        price: "¥1.00/度",
        distance: "0.5km",
        discountInfo: "无优惠",
        averageChargeTime: "平均充电2小时",
        chargePerMinute: "每次充电0.17元/分钟",
        speed: 5, // 充电速度
        state: {
          SuperCharge: {
            available: 5,
            total: 10
          },
          NormalCharge: {
            available: 10,
            total: 20
        }
      },
      },
      {
        id: 21,
        name: "超级电充电桩",
        price: "¥1.00/度",
        distance: "0.5km",
        discountInfo: "无优惠",
        averageChargeTime: "平均充电2小时",
        chargePerMinute: "每次充电0.17元/分钟",
        speed: 5, // 充电速度
        state: {
          SuperCharge: {
            available: 5,
            total: 10
          },
          NormalCharge: {
            available: 10,
            total: 20
        }
      },
      },
      {
        id: 22,
        name: "超级电充电桩",
        price: "¥1.00/度",
        distance: "0.5km",
        discountInfo: "无优惠",
        averageChargeTime: "平均充电2小时",
        chargePerMinute: "每次充电0.17元/分钟",
        speed: 5, // 充电速度
        state: {
          SuperCharge: {
            available: 5,
            total: 10
          },
          NormalCharge: {
            available: 10,
            total: 20
        }
      },
      },
      {
        id: 22,
        name: "超级电充电桩",
        price: "¥1.00/度",
        distance: "0.5km",
        discountInfo: "无优惠",
        averageChargeTime: "平均充电2小时",
        chargePerMinute: "每次充电0.17元/分钟",
        speed: 5, // 充电速度
        state: {
          SuperCharge: {
            available: 5,
            total: 10
          },
          NormalCharge: {
            available: 10,
            total: 20
        }
      },
      },
      {
        id: 22,
        name: "超级电充电桩",
        price: "¥1.00/度",
        distance: "0.5km",
        discountInfo: "无优惠",
        averageChargeTime: "平均充电2小时",
        chargePerMinute: "每次充电0.17元/分钟",
        speed: 5, // 充电速度
        state: {
          SuperCharge: {
            available: 5,
            total: 10
          },
          NormalCharge: {
            available: 10,
            total: 20
        }
      },
      },
      {
        id: 22,
        name: "超级电充电桩",
        price: "¥1.00/度",
        distance: "0.5km",
        discountInfo: "无优惠",
        averageChargeTime: "平均充电2小时",
        chargePerMinute: "每次充电0.17元/分钟",
        speed: 5, // 充电速度
        state: {
          SuperCharge: {
            available: 5,
            total: 10
          },
          NormalCharge: {
            available: 10,
            total: 20
        }
      },
      },
      {
        id: 22,
        name: "超级电充电桩",
        price: "¥1.00/度",
        distance: "0.5km",
        discountInfo: "无优惠",
        averageChargeTime: "平均充电2小时",
        chargePerMinute: "每次充电0.17元/分钟",
        speed: 5, // 充电速度
        state: {
          SuperCharge: {
            available: 5,
            total: 10
          },
          NormalCharge: {
            available: 10,
            total: 20
        }
      },
      },
      {
        id: 22,
        name: "超级电充电桩",
        price: "¥1.00/度",
        distance: "0.5km",
        discountInfo: "无优惠",
        averageChargeTime: "平均充电2小时",
        chargePerMinute: "每次充电0.17元/分钟",
        speed: 5, // 充电速度
        state: {
          SuperCharge: {
            available: 5,
            total: 10
          },
          NormalCharge: {
            available: 10,
            total: 20
        }
      },
      },
      {
        id: 22,
        name: "超级电充电桩",
        price: "¥1.00/度",
        distance: "0.5km",
        discountInfo: "无优惠",
        averageChargeTime: "平均充电2小时",
        chargePerMinute: "每次充电0.17元/分钟",
        speed: 5, // 充电速度
        state: {
          SuperCharge: {
            available: 5,
            total: 10
          },
          NormalCharge: {
            available: 10,
            total: 20
        }
      },
      },
      {
        id: 22,
        name: "超级电充电桩",
        price: "¥1.00/度",
        distance: "0.5km",
        discountInfo: "无优惠",
        averageChargeTime: "平均充电2小时",
        chargePerMinute: "每次充电0.17元/分钟",
        speed: 5, // 充电速度
        state: {
          SuperCharge: {
            available: 5,
            total: 10
          },
          NormalCharge: {
            available: 10,
            total: 20
        }
      },
      },
      {
        id: 22,
        name: "超级电充电桩1",
        price: "¥1.00/度",
        distance: "0.5km",
        discountInfo: "无优惠",
        averageChargeTime: "平均充电2小时",
        chargePerMinute: "每次充电0.17元/分钟",
        speed: 5, // 充电速度
        state: {
          SuperCharge: {
            available: 5,
            total: 10
          },
          NormalCharge: {
            available: 10,
            total: 20
        }
      },
      },
      {
        id: 22,
        name: "超级电充电桩",
        price: "¥1.00/度",
        distance: "0.5km",
        discountInfo: "无优惠",
        averageChargeTime: "平均充电2小时",
        chargePerMinute: "每次充电0.17元/分钟",
        speed: 5, // 充电速度
        state: {
          SuperCharge: {
            available: 5,
            total: 10
          },
          NormalCharge: {
            available: 10,
            total: 20
        }
      },
      },
      // 其他充电桩信息
    ];
  
    // 将数据设置到 data 中
    this.setData({
      chargingStations: stationsData.slice(0, this.data.displayCount),
      originalChargingStations: stationsData,
      totalStations: stationsData.length,
    });
  
    const markers = stationsData.map(pole => ({
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

});
