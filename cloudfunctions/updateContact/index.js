const cloud = require('wx-server-sdk');
cloud.init();
const db = cloud.database();

exports.main = async (event) => {
  const { id, updates } = event;

  try {
    await db.collection('contacts').doc(id).update({
      data: updates
    });
    return { success: true };
  } catch (error) {
    console.error('更新联系人失败:', error);
    return { success: false, error };
  }
};
