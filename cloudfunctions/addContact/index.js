const cloud = require('wx-server-sdk');

cloud.init();
const db = cloud.database();

exports.main = async (event, context) => {
  const { lastName, firstName, company, phoneNumbers, email, otherContact } = event;

  if (!lastName || !firstName || phoneNumbers.length === 0) {
    return {
      success: false,
      error: '必要信息缺失'
    };
  }

  try {
    const res = await db.collection('contacts').add({
      data: {
        lastName,
        firstName,
        company,
        phoneNumbers,
        email,
        otherContact,
        isFavorite: false, // 默认不收藏
        createdAt: new Date()
      }
    });

    return {
      success: true,
      data: res
    };
  } catch (err) {
    console.error('添加联系人失败:', err);
    return {
      success: false,
      error: err.message
    };
  }
};
