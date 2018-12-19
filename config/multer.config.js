const multer = require('multer');

const storage = multer.memoryStorage();
// eslint-disable-next-line object-shorthand
const upload = multer({ storage: storage });

module.exports = upload;
