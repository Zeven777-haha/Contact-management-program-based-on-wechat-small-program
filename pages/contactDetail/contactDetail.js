Page({
  data: {
    contact: {
      _id: '',
      lastName: '',
      firstName: '',
      company: '',
      phoneNumbers: [],
      email: '',
      otherContact: '',
      isFavorite: false // 收藏状态
    },
    showAddPhoneModal: false, // 控制新增电话号码弹窗
    newPhoneNumber: '' // 新增电话号码输入值
  },

  onLoad(options) {
    const contactId = options.id; // 获取联系人ID
    this.loadContact(contactId);
  },

  // 加载联系人详情
  loadContact(id) {
    wx.cloud.callFunction({
      name: 'getContacts',
      data: { filter: { _id: id } },
      success: (res) => {
        if (res.result.success && res.result.data.length > 0) {
          const contact = res.result.data[0];
          this.setData({ contact });
        } else {
          wx.showToast({ title: '未找到联系人', icon: 'none' });
        }
      },
      fail: (err) => {
        console.error('加载联系人失败:', err);
      }
    });
  },

  // 保存修改的联系人信息
  saveContact() {
    const updatedContact = this.data.contact;

    wx.cloud.callFunction({
      name: 'updateContact',
      data: {
        id: updatedContact._id,
        updates: updatedContact
      },
      success: () => {
        wx.showToast({ title: '保存成功', icon: 'success' });
      },
      fail: (err) => {
        console.error('保存失败:', err);
        wx.showToast({ title: '保存失败，请重试', icon: 'none' });
      }
    });
  },

  // 删除联系人
  deleteContact() {
    const contactId = this.data.contact._id;

    wx.showModal({
      title: '确认删除',
      content: '确定要删除此联系人吗？',
      success: (res) => {
        if (res.confirm) {
          wx.cloud.callFunction({
            name: 'deleteContact',
            data: { id: contactId },
            success: () => {
              wx.showToast({ title: '删除成功', icon: 'success' });

              // 通知上一页面刷新联系人列表
              const pages = getCurrentPages();
              const prevPage = pages[pages.length - 2];
              if (prevPage && typeof prevPage.refreshContacts === 'function') {
                prevPage.refreshContacts();
              }

              wx.navigateBack(); // 返回联系人列表页面
            },
            fail: (err) => {
              console.error('删除失败:', err);
              wx.showToast({ title: '删除失败，请重试', icon: 'none' });
            }
          });
        }
      }
    });
  },

  // 显示新增电话号码弹窗
  showAddPhoneModal() {
    this.setData({ showAddPhoneModal: true, newPhoneNumber: '' });
  },

  // 隐藏新增电话号码弹窗
  hideAddPhoneModal() {
    this.setData({ showAddPhoneModal: false });
  },

  // 绑定新增电话号码输入框
  onNewPhoneInput(event) {
    this.setData({ newPhoneNumber: event.detail.value });
  },

  // 保存新增电话号码
  saveNewPhoneNumber() {
    const newPhone = this.data.newPhoneNumber.trim();

    if (!newPhone) {
      wx.showToast({ title: '电话号码不能为空', icon: 'none' });
      return;
    }

    if (this.data.contact.phoneNumbers.includes(newPhone)) {
      wx.showToast({ title: '号码重复', icon: 'none' });
      return;
    }

    const updatedPhoneNumbers = [...this.data.contact.phoneNumbers, newPhone];

    wx.cloud.callFunction({
      name: 'updateContact',
      data: {
        id: this.data.contact._id,
        updates: { phoneNumbers: updatedPhoneNumbers }
      },
      success: () => {
        this.setData({
          'contact.phoneNumbers': updatedPhoneNumbers,
          showAddPhoneModal: false,
          newPhoneNumber: ''
        });
        wx.showToast({ title: '电话号码已添加', icon: 'success' });
      },
      fail: (err) => {
        console.error('新增电话号码失败:', err);
        wx.showToast({ title: '新增失败，请重试', icon: 'none' });
      }
    });
  },

  // 切换收藏状态
  toggleFavorite() {
    const updatedFavoriteStatus = !this.data.contact.isFavorite;

    wx.cloud.callFunction({
      name: 'updateContact',
      data: {
        id: this.data.contact._id,
        updates: { isFavorite: updatedFavoriteStatus }
      },
      success: () => {
        this.setData({ 'contact.isFavorite': updatedFavoriteStatus });
        wx.showToast({
          title: updatedFavoriteStatus ? '已加入收藏' : '已取消收藏',
          icon: 'success'
        });

        // 通知收藏夹页面更新
        const pages = getCurrentPages();
        const favoritesPage = pages.find((page) => page.route.includes('favorites'));
        if (favoritesPage && typeof favoritesPage.refreshFavorites === 'function') {
          favoritesPage.refreshFavorites();
        }
      },
      fail: (err) => {
        console.error('收藏切换失败:', err);
        wx.showToast({ title: '操作失败，请重试', icon: 'none' });
      }
    });
  }
});
