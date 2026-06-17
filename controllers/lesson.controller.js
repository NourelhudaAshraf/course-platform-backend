const Lesson = require("../models/lesson.model");
const UserLesson = require("../models/user-lesson.model");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
const {
  getAllDocs,
  getOne,
  updateOne,
  createOne,
} = require("../utils/handle-factory");
const catchAsync = require("../utils/catch-async");

const getAllLessons = getAllDocs(Lesson, null, {
  path: "course",
  select: "title",
});
const getLessonById = getOne(Lesson, { path: "course", select: "title" });
const updateLessonById = updateOne(Lesson);
const createLesson = createOne(Lesson);

const deleteLesson = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const lesson = await Lesson.findById(id);
  if (!lesson) return next({ status: 404, message: "Item not found!" });
  await UserLesson.deleteMany({ lesson: id });
  await Lesson.findByIdAndDelete(id);
  res.status(204).send();
});

//middleware
const setCourseId = (req, res, next) => {
  if (!req.body.course) req.body.course = req.params.courseId;
  next();
};

const uploadVideo = catchAsync(async (req, res, next) => {
  try {
    if (!req.file) return next();
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "video",
          folder: "lessons",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );
      //req.file.buffer -> binary data of the video file
      //so we need to convert it to a stream -> readable stream
      //streamifier.createReadStream(req.file.buffer) -> create a stream from the binary data
      //pipe the stream to the cloudinary upload stream -> stream is a writable stream
      /*
       * readable.on("data", chunk => {
       *  writable.write(chunk);
       * });

       * readable.on("end", () => {
       *   writable.end();
       * });
      */
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });

    req.body.videoUrl = result.secure_url;
    if (result.duration != null) {
      req.body.totalSeconds = Math.round(result.duration);
    }
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = {
  getAllLessons,
  createLesson,
  getLessonById,
  updateLessonById,
  deleteLesson,
  setCourseId,
  uploadVideo,
};
