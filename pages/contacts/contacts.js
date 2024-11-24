Page({
  data: {
    contacts: [] // 联系人列表
  },

  onLoad() {
    this.loadContacts();
  },

  onShow() {
    this.loadContacts();
  },

  // 加载联系人列表
  loadContacts() {
    wx.cloud.callFunction({
      name: 'getContacts',
      success: (res) => {
        if (res.result.success) {
          this.setData({ contacts: res.result.data });
        }
      },
      fail: (err) => {
        console.error('加载联系人失败:', err);
        wx.showToast({ title: '加载失败，请重试', icon: 'none' });
      }
    });
  },

  // 查看联系人详情
  viewContactDetail(event) {
    const contactId = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/contactDetail/contactDetail?id=${contactId}`
    });
  },

  // 一键导出
  exportContacts() {
    wx.cloud.callFunction({
      name: 'exportContacts',
      success: (res) => {
        if (res.result.success) {
          wx.cloud.downloadFile({
            fileID: res.result.fileID,
            success: (fileRes) => {
              wx.saveFile({
                tempFilePath: fileRes.tempFilePath,
                success: (saveRes) => {
                  wx.showToast({ title: '导出成功', icon: 'success' });
                  console.log('文件保存路径:', saveRes.savedFilePath);
                }
              });
            },
            fail: (err) => {
              console.error('文件下载失败:', err);
              wx.showToast({ title: '文件下载失败', icon: 'none' });
            }
          });
        } else {
          wx.showToast({ title: '导出失败，请重试', icon: 'none' });
        }
      },
      fail: (err) => {
        console.error('导出云函数失败:', err);
        wx.showToast({ title: '导出失败，请重试', icon: 'none' });
      }
    });
  },

  // 一键导入
  importContacts() {
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      extension: ['xlsx'],
      success: (res) => {
        const filePath = res.tempFiles[0].path;

        wx.cloud.uploadFile({
          cloudPath: `imports/${Date.now()}_contacts.xlsx`,
          filePath,
          success: (uploadRes) => {
            wx.cloud.callFunction({
              name: 'importContacts',
              data: { fileID: uploadRes.fileID },
              success: (callRes) => {
                if (callRes.result.success) {
                  wx.showToast({ title: '导入成功', icon: 'success' });
                  this.loadContacts(); // 导入成功后重新加载联系人
                } else {
                  wx.showToast({ title: '导入失败，请检查文件格式', icon: 'none' });
                }
              },
              fail: (err) => {
                console.error('调用导入云函数失败:', err);
                wx.showToast({ title: '导入失败，请重试', icon: 'none' });
              }
            });
          },
          fail: (err) => {
            console.error('文件上传失败:', err);
            wx.showToast({ title: '文件上传失败', icon: 'none' });
          }
        });
      },
      fail: (err) => {
        console.error('文件选择失败:', err);
        wx.showToast({ title: '请选择文件', icon: 'none' });
      }
    });
  }
});
