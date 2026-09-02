const swaggerJsdoc = require("swagger-jsdoc");
const env = require("./env");
const authSchema = require("../swagger/schemas/auth.schema");
const courseSchema = require("../swagger/schemas/course.schema");
const lessonSchema = require("../swagger/schemas/lesson.schema");
const userSchema = require("../swagger/schemas/user.schema");
const couponSchema = require("../swagger/schemas/coupon.schema");
const enrollmentSchema = require("../swagger/schemas/enrollment.schema");
const parameters = require("../swagger/parameters");
const responses = require("../swagger/responses");
const authPath = require("../swagger/paths/auth.path");
const coursePath = require("../swagger/paths/courses.path");
const enrollmentPath = require("../swagger/paths/enrollment.path");
const lessonPath = require("../swagger/paths/lesson.path");
const statisticsPath = require("../swagger/paths/statistics.path");
const userPath = require("../swagger/paths/user.path");
const couponPath = require("../swagger/paths/coupon.path");
const certificatePath = require("../swagger/paths/certificate.path");

const definition = {
  openapi: "3.0.0",
  info: {
    title: "Course Platform API",
    version: "1.0.0",
    description: "Backend API Documentation",
  },
  servers: [
    {
      // without it -> call current host server and add coursers without /api/v1
      url:
        env.NODE_ENV === "development"
          ? `${env.DEV_API_URL}:${env.PORT}/api/v1`
          : `${env.PROD_API_URL}/api/v1`,
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      ...authSchema,
      ...courseSchema,
      ...enrollmentSchema,
      ...lessonSchema,
      ...userSchema,
      ...couponSchema,
    },
    parameters,
    responses,
  },
  paths: {
    ...authPath,
    ...coursePath,
    ...enrollmentPath,
    ...lessonPath,
    ...statisticsPath,
    ...userPath,
    ...couponPath,
    ...certificatePath,
  },
};

module.exports = definition;
