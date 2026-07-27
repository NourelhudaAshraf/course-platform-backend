const swaggerJsdoc = require("swagger-jsdoc");
const env = require("./env");

const errorResponse = (description) => ({
  description,
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          status: { type: "string", example: "error" },
          message: { type: "string" },
        },
      },
    },
  },
});

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Course Platform API",
      version: "1.0.0",
      description: "Backend API Documentation",
    },
    tags: [
      { name: "Authentication" },
      { name: "Users" },
      { name: "Courses" },
      { name: "Lessons" },
      { name: "Enrollment" },
      { name: "Statistics" },
    ],
    servers: [
      {
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
      parameters: {
        IdParam: {
          name: "id",
          in: "path",
          required: true,
          description: "MongoDB ObjectId",
          schema: { type: "string", pattern: "^[a-fA-F0-9]{24}$" },
        },
        CourseIdParam: {
          name: "courseId",
          in: "path",
          required: true,
          description: "MongoDB ObjectId",
          schema: { type: "string", pattern: "^[a-fA-F0-9]{24}$" },
        },
        ResetTokenParam: {
          name: "token",
          in: "path",
          required: true,
          description: "Password reset token",
          schema: { type: "string", minLength: 64, maxLength: 64 },
        },
        PageQuery: {
          name: "page",
          in: "query",
          schema: { type: "integer", minimum: 1, default: 1 },
        },
        LimitQuery: {
          name: "limit",
          in: "query",
          schema: { type: "integer", minimum: 1, maximum: 25, default: 10 },
        },
        SortQuery: {
          name: "sort",
          in: "query",
          description: "Comma-separated fields; prefix with - for descending",
          schema: { type: "string", example: "-createdAt" },
        },
        TitleQuery: {
          name: "title",
          in: "query",
          description: "Filter by course title",
          schema: { type: "string", maxLength: 100 },
        },
        MinPriceQuery: {
          name: "minPrice",
          in: "query",
          schema: { type: "number", minimum: 0 },
        },
        MaxPriceQuery: {
          name: "maxPrice",
          in: "query",
          schema: { type: "number", minimum: 0 },
        },
      },
      schemas: {
        Signup: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: { type: "string", minLength: 3, maxLength: 30 },
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 8, maxLength: 30 },
          },
        },
        Login: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 8, maxLength: 30 },
          },
        },
        ForgotPassword: {
          type: "object",
          required: ["email"],
          properties: {
            email: { type: "string", format: "email" },
          },
        },
        ResetPassword: {
          type: "object",
          required: ["password"],
          properties: {
            password: { type: "string", minLength: 8, maxLength: 30 },
          },
        },
        UpdatePassword: {
          type: "object",
          required: ["currentPassword", "newPassword"],
          properties: {
            currentPassword: { type: "string", minLength: 8, maxLength: 30 },
            newPassword: { type: "string", minLength: 8, maxLength: 30 },
          },
        },
        CreateCourse: {
          type: "object",
          required: ["title", "description", "price", "image"],
          properties: {
            title: { type: "string", minLength: 3, maxLength: 100 },
            description: { type: "string", minLength: 8, maxLength: 1000 },
            price: { type: "number", minimum: 0.01 },
            image: { type: "string", format: "binary" },
          },
        },
        UpdateCourse: {
          type: "object",
          properties: {
            title: { type: "string", minLength: 3, maxLength: 100 },
            description: { type: "string", minLength: 8, maxLength: 1000 },
            price: { type: "number", minimum: 0.01 },
            image: { type: "string", format: "binary" },
          },
        },
        CreateLesson: {
          type: "object",
          required: ["title", "description", "video", "order"],
          properties: {
            title: { type: "string", minLength: 3, maxLength: 100 },
            description: { type: "string", minLength: 8, maxLength: 1000 },
            video: { type: "string", format: "binary" },
            order: { type: "number", minimum: 1 },
          },
        },
        UpdateLesson: {
          type: "object",
          properties: {
            title: { type: "string", minLength: 3, maxLength: 100 },
            description: { type: "string", minLength: 8, maxLength: 1000 },
            video: { type: "string", format: "binary" },
            order: { type: "number", minimum: 1 },
          },
        },
        UpdateUser: {
          type: "object",
          properties: {
            name: { type: "string", minLength: 3, maxLength: 30 },
            email: { type: "string", format: "email" },
          },
        },
        WatchLesson: {
          type: "object",
          required: ["lessonId", "lastPosition"],
          properties: {
            lessonId: { type: "string", pattern: "^[a-fA-F0-9]{24}$" },
            lastPosition: { type: "number", minimum: 0 },
          },
        },
      },
      responses: {
        BadRequest: errorResponse("Bad request"),
        Unauthorized: errorResponse("Unauthorized"),
        Forbidden: errorResponse("Forbidden"),
        NotFound: errorResponse("Not found"),
        ServerError: errorResponse("Internal server error"),
      },
    },
  },
  apis: ["./routes/*.js"],
};

module.exports = swaggerJsdoc(options);
