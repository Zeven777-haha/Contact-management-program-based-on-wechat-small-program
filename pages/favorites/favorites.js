Page({
  data: {
    favorites: []
  },

  onLoad() {
    this.loadFavorites();
  },

  onShow() {
    this.loadFavorites();
  },

  // 加载收藏的联系人
  loadFavorites() {
    wx.cloud.callFunction({
      name: 'getContacts',
      data: { filter: { isFavorite: true } },
      success: (res) => {
        if (res.result.success) {
          this.setData({ favorites: res.result.data });
        }
      },
      fail: (err) => {
        console.error('加载收藏夹失败:', err);
      }
    });
  },

  // 点击收藏联系人跳转详情
  viewContactDetail(event) {
    const contactId = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/contactDetail/contactDetail?id=${contactId}`
    });
  }
});
