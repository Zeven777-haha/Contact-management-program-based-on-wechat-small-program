const cloud = require('wx-server-sdk');
cloud.init();
const db = cloud.database();

exports.main = async (event) => {
  const { id } = event;
  try {
    await db.collection('contacts').doc(id).remove();
    return { success: true };
  } catch (error) {
    console.error('删除失败:', error);
    return { success: false, error };
  }
};
