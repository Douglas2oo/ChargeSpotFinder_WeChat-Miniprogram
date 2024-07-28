import MpProgress from "../../miniprogram_npm/mp-progress/progress.min";
Page({
  data: {
    stationInfo: null,
    isFavorite: false,
    comments: [], // 评论数据
    newComment: "", // 新评论内容
    show1: false,
    // show1: true,
    show2: false,
    timePeriod: "", // 用于存储当前时间段
    nextPeriod: "", // 用于存储下一个时间段
    currentPrice: [0, 0], // 用于存储当前电价
    nextPrice: [0, 0], // 用于存储当前电价
    gradientColor1: {
      '0%': '#80d783',
      '100%': '#34c500',
    },
    gradientColor2:  {
      '0%': '#d28c3b',
      '100%': '#e3b989',
    },
    showFee: false,
  },

  onLoad: function (options) {
    const stationId = parseInt(options.id, 10);
    this.loadStationInfo(stationId);
    this.loadFavoriteStatus(stationId);
    this.loadComments(stationId);
    this.updateTimePeriod();
  },

  updateTimePeriod() {
    const now = new Date();
    const hours = now.getHours();
  
    let period = "";
    if (hours >= 0 && hours < 8) {
      period = "00:00-08:00";
      this.nextPeriod = "08:00-10:00";
    } else if (hours >= 8 && hours < 10) {
      period = "08:00-10:00";
      this.nextPeriod = "10:00-11:00";
    } else if (hours >= 10 && hours < 11) {
      period = "10:00-11:00";
      this.nextPeriod = "11:00-12:00";
    } else if (hours >= 11 && hours < 12) {
      period = "11:00-12:00";
      this.nextPeriod = "12:00-14:00";
    } else if (hours >= 12 && hours < 14) {
      period = "12:00-14:00";
      this.nextPeriod = "15:00-17:00";
    } else if (hours >= 15 && hours < 17) {
      period = "15:00-17:00";
      this.nextPeriod = "17:00-19:00";
    } else if (hours >= 17 && hours < 19) {
      period = "17:00-19:00";
      this.nextPeriod = "19:00-24:00";
    } else {
      period = "19:00-24:00";
      this.nextPeriod = "00:00-08:00"; // 跨越到第二天的第一个时段
    }
  
    this.setData({
      timePeriod: period,
      nextPeriod: this.nextPeriod,
      currentPrice: this.data.stationInfo.fee[period] || [0, 0],
      nextPrice: this.data.stationInfo.fee[this.nextPeriod] || [0, 0],
    });
  },

  loadStationInfo: function (stationId) {
    const app = getApp();
    const mockData = app.globalData.originalStationData.find(
      (station) => station.id === stationId
    );
    this.setData({ stationInfo: mockData });
  },

  loadFavoriteStatus: function (stationId) {
    const favorites = wx.getStorageSync("favorites") || [];
    const isFavorite = favorites.some((fav) => fav.id === stationId);
    this.setData({ isFavorite });
  },

  loadComments: function (stationId) {
    const comments = getApp().globalData.comments[stationId] || [];
    this.setData({ comments: this.sortComments(comments) });
  },

  // 点击导航按钮
  onNavigateTap: function () {
    console.log("触发导航");
    // wx.navigateTo({
    //   url: '/pages/chargingMap/chargingMap'
    // });
  },

  addFavorite: function () {
    const userInfo = wx.getStorageSync("userInfo");
    if (!userInfo || userInfo.nickName === "未登录") {
      wx.showModal({
        title: "提示",
        content: "请先登录",
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({ url: "/pages/profile/profile" });
          }
        },
      });
      return;
    }

    // 用户已登录，处理收藏和取消收藏
    const stationId = this.data.stationInfo.id;
    let favorites = wx.getStorageSync("favorites") || [];
    const isFavorite = this.data.isFavorite;

    if (isFavorite) {
      favorites = favorites.filter((fav) => fav.id !== stationId);
      wx.showToast({ title: "取消收藏", icon: "success" });
    } else {
      favorites.push(this.data.stationInfo);
      wx.showToast({ title: "已收藏", icon: "success" });
    }

    wx.setStorageSync("favorites", favorites);
    this.setData({ isFavorite: !isFavorite });
  },

  // 扫码充电
  onScan: function () {
    console.log("扫码充电");
    wx.navigateTo({
      url: "/pages/scan/scan",
    });
  },

  // 添加评论
  onCommentInput: function (e) {
    this.setData({ newComment: e.detail.value });
  },

  submitComment: function () {
    const { stationInfo, newComment } = this.data;
    if (!newComment.trim()) {
      wx.showToast({ title: "评论不能为空", icon: "none" });
      return;
    }

    const userInfo = wx.getStorageSync("userInfo");
    if (!userInfo || userInfo.nickName === "未登录") {
      wx.showModal({
        title: "提示",
        content: "请先登录",
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({ url: "/pages/profile/profile" });
          }
        },
      });
      return;
    }

    const app = getApp();
    const stationId = stationInfo.id;
    let comments = app.globalData.comments[stationId];
    if (!comments) {
      comments = [];
    }
    comments.push({
      content: newComment,
      time: new Date().toLocaleString(),
      userInfo: {
        nickName: userInfo.nickName,
        avatarUrl: userInfo.avatarUrl,
      },
      likes: 0,
      liked: false,
    });

    app.globalData.comments[stationId] = comments;
    this.setData({ comments: this.sortComments(comments), newComment: "" });
    wx.showToast({ title: "评论成功", icon: "success" });
  },

  toggleLikeComment: function (e) {
    const { stationInfo } = this.data;
    const commentIndex = e.currentTarget.dataset.index;

    const app = getApp();
    const stationId = stationInfo.id;
    let comments = app.globalData.comments[stationId];

    if (comments && comments.length > commentIndex) {
      if (comments[commentIndex].liked) {
        comments[commentIndex].likes -= 1;
        comments[commentIndex].liked = false;
      } else {
        comments[commentIndex].likes += 1;
        comments[commentIndex].liked = true;
      }
      app.globalData.comments[stationId] = comments;
      this.setData({ comments: this.sortComments(comments) });
    }
  },

  deleteComment: function (e) {
    const { stationInfo } = this.data;
    const commentIndex = e.currentTarget.dataset.index;

    const app = getApp();
    const stationId = stationInfo.id;
    let comments = app.globalData.comments[stationId];

    if (comments && comments.length > commentIndex) {
      comments.splice(commentIndex, 1);
      app.globalData.comments[stationId] = comments;
      this.setData({ comments: this.sortComments(comments) });
      wx.showToast({ title: "删除成功", icon: "success" });
    }
  },

  sortComments: function (comments) {
    return comments.sort((a, b) => {
      if (b.likes !== a.likes) {
        return b.likes - a.likes;
      } else {
        return new Date(a.time) - new Date(b.time);
      }
    });
  },

  //动作面板控制-----------------------------------------------------------
  onClose() {
    this.setData({ show1: false });
  },

  showGun: function () {
    this.setData({ show1: true });
  },
  //----------------------------------------------------------------------

  //费用展示面板控制-------------------------------------------------------
  showFee: function () {
    this.setData({ showFee: true });
  },
  closeFee() {
    this.setData({ showFee: false });
  },
  //----------------------------------------------------------------------
});
