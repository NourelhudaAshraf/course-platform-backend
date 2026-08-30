module.exports = {
  "/enrollment/checkout-session/{courseId}": {
    get: {
      tags: ["Enrollment"],
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: "#/components/parameters/CourseIdParam" }],
      responses: {
        200: {
          description: "Checkout session created successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string", example: "success" },
                  data: {
                    type: "object",
                    properties: {
                      url: { type: "string" },
                    },
                  },
                },
              },
            },
          },
        },
        400: { $ref: "#/components/responses/BadRequest" },
        401: { $ref: "#/components/responses/Unauthorized" },
        403: { $ref: "#/components/responses/Forbidden" },
        404: { $ref: "#/components/responses/NotFound" },
        500: { $ref: "#/components/responses/ServerError" },
      },
    },
  },
  "/enrollment/my-courses": {
    get: {
      tags: ["Enrollment"],
      summary: "Get All Enrolled Courses of Current User",
      security: [{ bearerAuth: [] }],
      parameters: [
        { $ref: "#/components/parameters/PageQuery" },
        { $ref: "#/components/parameters/LimitQuery" },
        { $ref: "#/components/parameters/SortQuery" },
      ],
      responses: {
        200: {
          description: "Enrolled courses retrieved successfully",
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
                      $ref: "#/components/schemas/Enrollment",
                    },
                  },
                },
              },
            },
          },
        },
        400: { $ref: "#/components/responses/BadRequest" },
        401: { $ref: "#/components/responses/Unauthorized" },
        500: { $ref: "#/components/responses/ServerError" },
      },
    },
  },
  "/enrollment/{courseId}": {
    get: {
      tags: ["Enrollment"],
      summary: "Checks If a Course Already Enrolled or Not",
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: "#/components/parameters/CourseIdParam" }],
      responses: {
        200: {
          description: "Checks if course is enrolled or not",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string", example: "success" },
                  data: { type: "boolean" },
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
  },
  "/enrollment": {
    get: {
      tags: ["Enrollment"],
      summary: "Admin Total Payment",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "All payments retrieved successfully",
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
                      $ref: "#/components/schemas/Enrollment",
                    },
                  },
                },
              },
            },
          },
        },
        400: { $ref: "#/components/responses/BadRequest" },
        401: { $ref: "#/components/responses/Unauthorized" },
        403: { $ref: "#/components/responses/Forbidden" },
        500: { $ref: "#/components/responses/ServerError" },
      },
    },
  },
};
