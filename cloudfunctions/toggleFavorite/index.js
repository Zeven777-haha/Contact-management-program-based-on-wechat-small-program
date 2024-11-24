const cloud = require('wx-server-sdk');
cloud.init();

exports.main = async (event) => {
  const db = cloud.database();
  const { id, isFavorite } = event;

  try {
    const result = await db.collection('contacts').doc(id).update({
      data: { isFavorite: !isFavorite }
    });
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error };
  }
};
