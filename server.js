const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const env = require("./config/env");
require("./config/cloudinary");
const authRouter = require("./routes/auth.routes");
const courseRouter = require("./routes/course.routes");
const userRouter = require("./routes/user.routes");
const lessonRouter = require("./routes/lesson.routes");
const enrollmentRouter = require("./routes/enrollment.routes");
const statisticsRouter = require("./routes/statistics.routes");
const { webhookHandler } = require("./controllers/enrollment.controller");
const cors = require("cors");
const connectDB = require("./utils/connect-db");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const {
  authLimiter,
  webhookLimiter,
} = require("./middleware/rate-limit.middleware");

const app = express();
const port = env.PORT;

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
// sets HTTP security headers like X-Frame-Options: SAMEORIGIN.
app.use(helmet());
app.use(express.json({ limit: "1mb" }));
// parses cookies from the request and adds them to the request object.
app.use(cookieParser());

app.use("/api/v1/auth", authLimiter, authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/courses", courseRouter);
app.use("/api/v1/lessons", lessonRouter);
app.use("/api/v1/enrollment", enrollmentRouter);
app.use("/api/v1/statistics", statisticsRouter);

// to match any route that is not defined
app.use((req, res, next) => next({ status: 404, message: "Route not found" }));

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
