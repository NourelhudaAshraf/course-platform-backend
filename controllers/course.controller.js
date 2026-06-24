const Course = require("../models/course.model");
const catchAsync = require("../utils/catch-async");
const { deleteCourseService } = require("../services/course.service");
const {
  getAllDocs,
  getOne,
  updateOne,
  createOne,
} = require("../utils/handle-factory");

const getAllCourses = getAllDocs(Course, null, {
  path: "user",
  select: "name",
});
const getCourseById = getOne(Course, { path: "user", select: "name" });
const updateCourseById = updateOne(Course);
const createCourse = createOne(Course);
const deleteCourse = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  await deleteCourseService(req.course, id);
  res.status(204).send();
});

module.exports = {
  getAllCourses,
  getCourseById,
  updateCourseById,
  createCourse,
  deleteCourse,
};
