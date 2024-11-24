Page({
  data: {
    lastName: '',
    firstName: '',
    company: '',
    phoneNumber: '',
    email: '',
    otherContact: '',
    isFavorite: false // 是否勾选收藏
  },

  // 输入框绑定
  onInput(event) {
    const field = event.currentTarget.dataset.field;
    this.setData({ [field]: event.detail.value });
  },

  // 勾选“加入收藏”
  toggleFavorite(event) {
    this.setData({ isFavorite: event.detail.value });
  },

  // 保存联系人
  saveContact() {
    const { lastName, firstName, company, phoneNumber, email, otherContact, isFavorite } = this.data;

    // 校验必填字段
    if (!lastName || !firstName) {
      wx.showToast({ title: '姓氏和名字不能为空', icon: 'none' });
      return;
    }

    // 构建联系人数据
    const contact = {
      lastName,
      firstName,
      company,
      phoneNumbers: phoneNumber ? [phoneNumber] : [],
      email,
      otherContact,
      isFavorite
    };

    // 调用云函数保存联系人
    wx.cloud.callFunction({
      name: 'addContact',
      data: contact,
      success: () => {
        wx.showToast({ title: '联系人信息已保存', icon: 'success' });

        // 重置输入框
        this.setData({
          lastName: '',
          firstName: '',
          company: '',
          phoneNumber: '',
          email: '',
          otherContact: '',
          isFavorite: false
        });

        // 返回联系人页面
        wx.switchTab({
          url: '/pages/contacts/contacts' // 联系人页面路径
        });
      },
      fail: (err) => {
        console.error('保存联系人失败:', err);
        wx.showToast({ title: '保存失败，请重试', icon: 'none' });
      }
    });
  }
});
