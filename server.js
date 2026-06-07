const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const authRouter = require("./routes/Auth");
const courseRouter = require("./routes/Courses");
const userRouter = require("./routes/Users");
const lessonRouter = require("./routes/Lessons");
const enrollmentRouter = require("./routes/Enrollment");
const statisticsRouter = require("./routes/Statistics");
const cors = require("cors");
const connectDB = require("./utils/connectDB");

const app = express();
const port = process.env.PORT || 8080;

connectDB();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
//middleware to parse the body of the request
app.use(express.json({ limit: "10kb" })); // limit the size of the request body to 10kb

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
