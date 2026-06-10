const Course = require("../models/Courses");
const { v2: cloudinary } = require("cloudinary");
const streamifier = require("streamifier");
const {
  getAllDocs,
  getOne,
  updateOne,
  createOne,
  deleteOne,
} = require("./handleFactory");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const getAllCourses = getAllDocs(Course);
const getCourseById = getOne(Course);
const updateCourseById = updateOne(Course);
const createCourse = createOne(Course);
const deleteCourse = deleteOne(Course);

//middleware
const setUserId = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user._id;
  next();
};

const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) return next();
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "courses" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });

    req.body.image = result.secure_url;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCourses,
  getCourseById,
  updateCourseById,
  createCourse,
  deleteCourse,
  setUserId,
  uploadImage,
};
