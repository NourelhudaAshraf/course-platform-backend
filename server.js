const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
require("./config/cloudinary");
const authRouter = require("./routes/Auth");
const courseRouter = require("./routes/Courses");
const userRouter = require("./routes/Users");
const lessonRouter = require("./routes/Lessons");
const enrollmentRouter = require("./routes/Enrollment");
const statisticsRouter = require("./routes/Statistics");
const { webhookHandler } = require("./controllers/Enrollments");
const cors = require("cors");
const connectDB = require("./utils/connectDB");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const { authLimiter, webhookLimiter } = require("./middleware/rateLimit");

const app = express();
const port = process.env.PORT || 8080;

connectDB();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://course-platform-three-psi.vercel.app",
    ],
    credentials: true,
  }),
);
app.post(
  "/webhook",
  webhookLimiter,
  express.raw({ type: "application/json" }),
  webhookHandler,
);
app.use(helmet());
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

app.use("/api/v1/auth", authLimiter, authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/courses", courseRouter);
app.use("/api/v1/lessons", lessonRouter);
app.use("/api/v1/enrollment", enrollmentRouter);
app.use("/api/v1/statistics", statisticsRouter);

// handle errors globally
app.use((err, req, res, next) => {
  if (err.name === "MulterError") {
    return res.status(400).json({
      status: "error",
      message:
        err.code === "LIMIT_FILE_SIZE"
          ? "File too large (max 10MB)"
          : err.message,
    });
  }
  if (err.name === "CastError") {
    return res
      .status(400)
      .json({ status: "error", message: "Invalid ID format" });
  }
  err.status = err.status || 500;
  res.status(err.status).json({
    status: "error",
    message: err.message,
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});
