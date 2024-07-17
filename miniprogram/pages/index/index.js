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
    const app = getApp();
    if (app.globalData.searchQuery) {
      this.setData({
        searchQuery: app.globalData.searchQuery,
        searching: true,
      });
      this.onSearchInput();
      app.globalData.searchQuery = '';
    } else {
      this.setData({
      displayCount: 20,
      chargingStations: this.data.originalChargingStations.slice(0, 20),
      totalStations: 20,
      allLoaded: false,
      searching: false,
      activeButton: '',
      searchQuery: '',
    })
    }
    
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

//搜索跳转------------------------------------------------
onSearchFocus: function() {
  getApp().globalData.searchQuery = this.data.searchQuery;
  wx.navigateTo({
    url: `/pages/searching/searching`,
  });
},
//----------------------------------------------

// 搜索功能--------------------------------------------------
  onSearchInput: function() {{
    this.setData({
      displayCount: 20,
      totalStations: 20,
      allLoaded: false,
      activeButton: '',
    });
    this.filterStations();
    }
  
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

// 加载数据----------------------------------------------------------
  loadMarkers: function() {
    const app = getApp();
    const stationsData = app.globalData.originalStationData;
  
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
  //--------------------------------------------------------------

});
