App({
  onLaunch: function() {
  // 全局数据可以在这里设置
  this.globalData = {};
  // 监听网络状态变化
  this.monitorNetworkChange();
  this.loadStationData();
  },

  // 全局数据
  globalData: {
    searchBoxPosition: 'bottom',
    originalStationData: [],
    searchQuery: '',
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
  },

  loadStationData: function() {
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
        faculty: ['卫生间', '停车', '便利店'],
        workingTime: '周一~周日 8:00-22:00',
        location: '广州市天河区天河路123号',
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
      },
        chargingGun: [
          {
            id: 246542322354218489,
            power: 250,
            type: 'SuperCharge',
            mode: '直流',
            energy: 100,
            available: true,
          },
          {
            id: 246542322354218489,
            power: 250,
            type: 'SuperCharge',
            mode: '直流',
            energy: 100,
            available: true,
          }
        ]
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
        id: 32,
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
        id: 33,
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
        id: 34,
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
        id: 35,
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
        id: 36,
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
        id: 37,
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
        id: 38,
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
        id: 39,
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
        id: 40,
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
        id: 41,
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

    this.globalData.originalStationData = stationsData;
  },
});
