const Course = require("../models/Courses");
const {
  getAllDocs,
  getOne,
  updateOne,
  createOne,
  deleteOne,
} = require("./handleFactory");

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

module.exports = {
  getAllCourses,
  getCourseById,
  updateCourseById,
  createCourse,
  deleteCourse,
  setUserId,
};
