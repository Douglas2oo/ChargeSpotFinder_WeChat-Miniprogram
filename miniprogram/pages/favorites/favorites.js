Page({
  data: {
    favorites: [] // 收藏的数据
  },

  onLoad: function() {
    // 从本地存储中获取收藏数据
    const favorites = wx.getStorageSync('favorites') || [];
    console.log('加载的收藏数据:', favorites);
    this.setData({ favorites });
    if (favorites.length === 0) {
      console.log('没有收藏的数据');
    }
  },

  onRemoveFavorite: function(e) {
    const stationId = e.currentTarget.dataset.id; // 获取要移除的收藏项的ID
    let favorites = wx.getStorageSync('favorites') || [];
    favorites = favorites.filter(fav => fav.id !== stationId); // 移除指定ID的收藏项
    wx.setStorageSync('favorites', favorites); // 更新本地存储
    this.setData({ favorites }); // 更新页面显示
  },

  navigateToDetail_id: function(event) {
    const { id } = event.currentTarget.dataset;
    // 跳转到详情页并传递充电桩的ID
    wx.navigateTo({
      url: `/pages/chargingDetail/chargingDetail?id=${id}`
    });
  }
});
