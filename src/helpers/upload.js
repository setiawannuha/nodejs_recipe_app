const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { internalError, failed } = require("../helpers/response");

const multerUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./public/images/recipes/");
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const filename = Date.now() + "" + ext;
      cb(null, filename);
    },
  }),
});

const upload = (req, res, next) => {
  const multerSingle = multerUpload.single("image");
  multerSingle(req, res, (err) => {
    if (err) {
      fs.unlinkSync(`./public/images/recipes/${req.file.filename}`);
      failed(res, "Failed Upload File");
      return;
    } else {
      next();
    }
  });
};

module.exports = upload;
