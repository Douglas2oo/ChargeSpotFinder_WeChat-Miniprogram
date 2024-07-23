// pages/error/location/location.js
Component({
  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    checkLocationPermission: function() {
      // 获取用户的当前设置
      wx.getSetting({
        success: (res) => {
          // 判断位置信息是否被授权
          if (!res.authSetting['scope.userLocation']) {
            // 未授权，弹出模态对话框
            wx.showModal({
              title: '定位服务未开启',
              content: '请开启定位服务，以便我们提供更好的服务。',
              showCancel: false, // 不显示取消按钮
              confirmText: '我知道了'
            });
          }
        },
        fail: () => {
          // 获取设置失败时的处理
          wx.showToast({
            title: '无法获取设置状态',
            icon: 'none'
          });
        }
      });
    }
  },

  lifetimes: {
    attached: function() {
      // 组件实例进入页面节点树时，检查定位权限
      this.checkLocationPermission();
    }
  }
});
