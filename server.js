const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const authRouter = require("./routes/Auth");
const courseRouter = require("./routes/Courses");
const userRouter = require("./routes/Users");
const lessonRouter = require("./routes/Lessons");
const enrollmentRouter = require("./routes/Enrollment");
const statisticsRouter = require("./routes/Statistics");
const { webhookHandler } = require("./controllers/Enrollments");
const cors = require("cors");
const connectDB = require("./utils/connectDB");

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
app.post("/webhook", express.raw({ type: "application/json" }), webhookHandler);
//middleware to parse the body of the request
app.use(express.json({ limit: "100mb" })); // limit the size of the request body to 100mb

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/courses", courseRouter);
app.use("/api/v1/lessons", lessonRouter);
app.use("/api/v1/enrollment", enrollmentRouter);
app.use("/api/v1/statistics", statisticsRouter);

// handle errors globally
app.use((err, req, res, next) => {
  err.status = err.status || 500;
  res.status(err.status).json({
    message: err.message,
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});
