const cloud = require('wx-server-sdk');
cloud.init();
const db = cloud.database();

exports.main = async (event) => {
  const { filter } = event;

  try {
    const result = await db.collection('contacts').where(filter).get();
    return { success: true, data: result.data };
  } catch (error) {
    console.error('查询联系人失败:', error);
    return { success: false, error };
  }
};
