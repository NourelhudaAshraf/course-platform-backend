const Course = require("../models/course.model");
const catchAsync = require("../utils/catch-async");
const {
  deleteCourseService,
  getCourseByIdPublishService,
} = require("../services/course.service");
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

const getPublishedCourses = getAllDocs(
  Course,
  null,
  {
    path: "user",
    select: "name",
  },
  { status: "published" },
);
const getCourseById = getOne(Course, { path: "user", select: "name" });
const getCourseByIdPublish = catchAsync(async (req, res) => {
  const { id } = req.params;
  const course = await getCourseByIdPublishService(id);
  res.status(200).json({
    status: "success",
    data: course,
  });
});
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
  getPublishedCourses,
  getCourseByIdPublish,
  updateCourseById,
  createCourse,
  deleteCourse,
};
