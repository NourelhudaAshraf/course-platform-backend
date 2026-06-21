const multer = require("multer");

const TEN_MB = 10 * 1024 * 1024;

const imageMimes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const videoMimes = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/x-msvideo",
];

// cb -> callback function that tells Multer whether to accept or reject the file.
// cb(Error, boolean)
const imageFilter = (req, file, cb) => {
  if (imageMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, WebP, and GIF images are allowed"));
  }
};

const videoFilter = (req, file, cb) => {
  if (videoMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only MP4, WebM, QuickTime, and AVI videos are allowed"));
  }
};

const uploadImage = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: TEN_MB },
  fileFilter: imageFilter,
});

const uploadVideo = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: TEN_MB },
  fileFilter: videoFilter,
});

module.exports = { uploadImage, uploadVideo };
