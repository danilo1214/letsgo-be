const { multerUpload } = require('../cloud/multer');
const { cloudinaryConfig } = require('../cloud/cloudinary');
const { streamUpload } = require('../cloud/streamUpload');

module.exports = {
  cloudinaryConfig,
  multerUpload,
  streamUpload,
};
