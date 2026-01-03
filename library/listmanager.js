const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

// Config
const DB_PATH = path.join(__dirname, 'database', 'lists.json');
const CATBOX_API = 'https://catbox.moe/user/api.php';

// Init database
if (!fs.existsSync(DB_PATH)) {
  fs.mkdirSync(path.join(__dirname, 'database'), { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify({ lists: [] }, null, 2));
}

const listManager = {
  /**
   * Upload gambar ke Catbox
   * @param {string} filePath 
   * @returns {Promise<string>} URL gambar
   */
  uploadImage: async (filePath) => {
    const form = new FormData();
    form.append('reqtype', 'fileupload');
    form.append('fileToUpload', fs.createReadStream(filePath));

    try {
      const { data } = await axios.post(CATBOX_API, form, {
        headers: form.getHeaders()
      });
      return data.includes('http') ? data : null;
    } catch (error) {
      console.error('[UPLOAD ERROR]', error.message);
      return null;
    } finally {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
  },

  /**
   * Tambahkan list baru
   * @param {object} params 
   * @returns {Promise<boolean>}
   */
  addList: async ({ groupId, key, text, imageBuffer, creator }) => {
    const db = JSON.parse(fs.readFileSync(DB_PATH));
    
    // Cek duplikat
    if (db.lists.some(list => list.group === groupId && list.key === key.toLowerCase())) {
      throw new Error('Key sudah digunakan di grup ini');
    }

    // Upload gambar jika ada
    let imageUrl = null;
    if (imageBuffer) {
      const tempPath = path.join(__dirname, 'temp_upload.jpg');
      fs.writeFileSync(tempPath, imageBuffer);
      imageUrl = await this.uploadImage(tempPath);
      if (!imageUrl) throw new Error('Gagal upload gambar');
    }

    // Tambahkan ke database
    db.lists.push({
      group: groupId,
      key: key.toLowerCase(),
      text,
      imageUrl,
      creator,
      createdAt: new Date().toISOString()
    });

    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
    return true;
  },

  /**
   * Dapatkan list dalam grup
   * @param {string} groupId 
   * @returns {Array}
   */
  getLists: (groupId) => {
    const db = JSON.parse(fs.readFileSync(DB_PATH));
    return db.lists.filter(list => list.group === groupId);
  },

  /**
   * Hapus list
   * @param {string} groupId 
   * @param {string} key 
   * @returns {boolean}
   */
  deleteList: (groupId, key) => {
    const db = JSON.parse(fs.readFileSync(DB_PATH));
    const initialLength = db.lists.length;
    
    db.lists = db.lists.filter(
      list => !(list.group === groupId && list.key === key.toLowerCase())
    );
    
    if (db.lists.length !== initialLength) {
      fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
      return true;
    }
    return false;
  }
};

module.exports = listManager;