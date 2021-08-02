const multer = require('multer');

const storage = multer.memoryStorage();
const multerUpload = multer({ storage }).single('image');
module.exports = { multerUpload };
