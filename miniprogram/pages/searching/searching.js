// pages/searching/searching.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchQuery: '',
    list:[],
    search:''
  },

  onShow: function () {
    if (wx.getStorageSync('search_history') ){
      this.setData({
        list:JSON.parse(wx.getStorageSync('search_history') ).slice(0, 15)
      })
    }
    const app = getApp();
    this.setData({
      search: app.globalData.searchQuery
    })
  },

  getData(e){
    let data = e.detail.value.replace(/(^\s*)|(\s*$)/g, "");//去掉前后的空格
      if (data.trim() != '') {
        this.data.list.forEach((key, index) => {
          if (key == data) {
            this.data.list.splice(index, 1);
          }
        })
        this.data.list.unshift(data);
        this.setData({
          list: this.data.list.slice(0,15),
          searchQuery: e.detail.value
        })
        wx.setStorageSync('search_history', JSON.stringify(this.data.list))
        this.switch(data);
      }
  },

   //清空历史
   clearHistory() {
    this.setData({
      list:[]
    })
    wx.removeStorageSync('search_history')
  },

  onSearchInput: function(e) {
    this.setData({
      search: e.detail.value,
      searchQuery: e
    });
  },

  getSearchOne(e){
    let {index}=e.currentTarget.dataset,{list}=this.data;
    let va=list[index]
    this.setData({
      search:va
    })
    this.data.list.forEach((item, index) => {
      if (item == va) {
        this.data.list.splice(index, 1);
      }
    })
    this.data.list.unshift(va);
    this.setData({
      list:this.data.list.slice(0,15)
    })
    console.log(this.data.list)
    wx.setStorageSync('search_history', JSON.stringify(this.data.list))
    this.switch(va);
  },

// 搜索跳转-----------------------------------------------------
switch: function(e) {
  console.log('Switch function called with parameter:', e);

  // 设置全局变量或本地存储
  getApp().globalData.searchQuery = e;
  wx.switchTab({
    url: '/pages/index/index',
    success: function(res) {
      console.log('Navigation successful');
    },
    fail: function(err) {
      console.log('Navigation failed:', err);
    }
  });
},

//-------------------------------------------------------------

// 搜索确认-----------------------------------------------------
onSearchConfirm: function() {
  const e =  this.data.searchQuery
  if (e) {
    this.getData(e);
  // handle search confirm button click event
  const content = e.detail.value;
  this.switch(content);
  }
  
},
//-------------------------------------------------------------

})