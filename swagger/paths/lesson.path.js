const successResponse = (description) => ({
  description,
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          status: { type: "string", example: "success" },
          data: { $ref: "#/components/schemas/Lesson" },
        },
      },
    },
  },
});
module.exports = {
  "/courses/{courseId}/lessons/general": {
    get: {
      tags: ["Lessons"],
      summary: "Get All Lessons without Video Urls",
      parameters: [{ $ref: "#/components/parameters/CourseIdParam" }],
      responses: {
        200: {
          description: "General lessons retrieved successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string", example: "success" },
                  data: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/GeneralLesson",
                    },
                  },
                },
              },
            },
          },
        },
        401: { $ref: "#/components/responses/Unauthorized" },
        500: { $ref: "#/components/responses/ServerError" },
      },
    },
  },
  "/courses/{courseId}/lessons": {
    parameters: [{ $ref: "#/components/parameters/CourseIdParam" }],
    get: {
      tags: ["Lessons"],
      summary: "Get All Lessons with Video Urls",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "All lessons retrieved successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string", example: "success" },
                  results: { type: "number" },
                  totalPages: { type: "number" },
                  page: { type: "number" },
                  data: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/Lesson",
                    },
                  },
                },
              },
            },
          },
        },
        400: { $ref: "#/components/responses/BadRequest" },
        401: { $ref: "#/components/responses/Unauthorized" },
        404: { $ref: "#/components/responses/NotFound" },
        500: { $ref: "#/components/responses/ServerError" },
      },
    },
    post: {
      tags: ["Lessons"],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: { $ref: "#/components/schemas/CreateLesson" },
          },
        },
      },
      responses: {
        201: successResponse("Lesson created successfully"),
        400: { $ref: "#/components/responses/BadRequest" },
        401: { $ref: "#/components/responses/Unauthorized" },
        404: { $ref: "#/components/responses/NotFound" },
        500: { $ref: "#/components/responses/ServerError" },
      },
    },
  },
  "/courses/{courseId}/lessons/{id}": {
    parameters: [
      { $ref: "#/components/parameters/CourseIdParam" },
      { $ref: "#/components/parameters/IdParam" },
    ],
    get: {
      tags: ["Lessons"],
      security: [{ bearerAuth: [] }],
      responses: {
        200: successResponse("Lesson retrieved successfully"),
        400: { $ref: "#/components/responses/BadRequest" },
        401: { $ref: "#/components/responses/Unauthorized" },
        404: { $ref: "#/components/responses/NotFound" },
        500: { $ref: "#/components/responses/ServerError" },
      },
    },
    patch: {
      tags: ["Lessons"],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: { $ref: "#/components/schemas/UpdateLesson" },
          },
        },
      },
      responses: {
        200: successResponse("Lesson updated successfully"),
        400: { $ref: "#/components/responses/BadRequest" },
        401: { $ref: "#/components/responses/Unauthorized" },
        404: { $ref: "#/components/responses/NotFound" },
        500: { $ref: "#/components/responses/ServerError" },
      },
    },
    delete: {
      tags: ["Lessons"],
      security: [{ bearerAuth: [] }],
      responses: {
        204: { description: "Lesson deleted successfully" },
        400: {
          $ref: "#/components/responses/BadRequest",
        },
        401: { $ref: "#/components/responses/Unauthorized" },
        404: { $ref: "#/components/responses/NotFound" },
        500: {
          $ref: "#/components/responses/ServerError",
        },
      },
    },
  },
};
