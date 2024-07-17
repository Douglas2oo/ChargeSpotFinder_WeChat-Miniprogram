App({
  onLaunch: function() {
  // 全局数据可以在这里设置
  this.globalData = {};
  // 监听网络状态变化
  this.monitorNetworkChange();
  },

  // 全局数据
  globalData: {
    searchBoxPosition: 'bottom',
  },

  // 监听网络状态变化的方法
  monitorNetworkChange: function() {
  const that = this;
  wx.onNetworkStatusChange((res) => {
    if (!res.isConnected) {
    // 网络未连接时弹出模态对话框
    that.showNetworkModal();
    }
  });
  },

  // 显示网络错误模态对话框的方法
  showNetworkModal: function() {
  const that = this;
  wx.showModal({
    title: '网络错误',
    content: '当前网络不可用，请检查你的网络设置',
    showCancel: true, // 显示取消按钮
    cancelText: '取消',
    confirmText: '重试', // 设置确认按钮文本为"重试"
    success: function(res) {
    if (res.confirm) {
      // 用户点击了重试按钮
      console.log('用户点击重试');
      // 再次检查网络状态并尝试刷新页面或其他操作
      that.checkNetworkAndRetry();
    } else if (res.cancel) {
      // 用户点击了取消按钮
      console.log('用户点击取消');
      // 在这里处理用户取消操作，如不做任何事情或显示提示信息
    }
    }
  });
  },

  // 检查网络并重试的方法
  checkNetworkAndRetry: function() {
  wx.getNetworkType({
    success: (res) => {
    const networkType = res.networkType;
    if (networkType === 'none') {
      // 如果还是没有网络连接，再次弹出模态对话框
      this.showNetworkModal();
    } else {
      // 有网络连接，执行重试逻辑，比如刷新页面数据
      // 这里根据你的实际需求来实现具体的重试逻辑
      console.log('网络已恢复，执行重试逻辑');
    }
    },
    fail: () => {
    // 获取网络状态失败，也提供重试机会
    this.showNetworkModal();
    }
  });
  }
});
