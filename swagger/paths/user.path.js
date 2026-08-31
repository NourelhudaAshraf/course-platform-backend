module.exports = {
  "/users/update-me": {
    patch: {
      tags: ["Users"],
      summary: "User can update their information",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/UpdateUser" },
          },
        },
      },
      responses: {
        200: {
          description: "User updated successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string", example: "success" },
                  data: { $ref: "#/components/schemas/User" },
                },
              },
            },
          },
        },
        400: {
          $ref: "#/components/responses/BadRequest",
        },
        401: { $ref: "#/components/responses/Unauthorized" },
        500: { $ref: "#/components/responses/ServerError" },
      },
    },
  },
  "/users/watch-lesson": {
    post: {
      tags: ["Users"],
      summary: "User can store watched seconds so that progress updated",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/WatchLesson" },
          },
        },
      },
      responses: {
        200: {
          description: "Lesson progress stored successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string", example: "success" },
                  data: { $ref: "#/components/schemas/UserLesson" },
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
  "/users/courses/{courseId}/user-lessons": {
    get: {
      tags: ["Users"],
      summary: "Get completed lessons of course by user",
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: "#/components/parameters/CourseIdParam" }],
      responses: {
        200: {
          description: "Get Lessons which user watches",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string", example: "success" },
                  data: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        _id: { type: "string" },
                        lesson: { type: "string" },
                        completed: { type: "boolean" },
                        lastPosition: { type: "number" },
                      },
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
  },
  "/users": {
    get: {
      tags: ["Users"],
      summary: "Get All Users",
      security: [{ bearerAuth: [] }],
      parameters: [
        { $ref: "#/components/parameters/SearchUserQuery" },
        { $ref: "#/components/parameters/RoleUserQuery" },
        { $ref: "#/components/parameters/PageQuery" },
        { $ref: "#/components/parameters/LimitQuery" },
        { $ref: "#/components/parameters/SortQuery" },
      ],
      responses: {
        200: {
          description: "All users retrieved successfully",
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
                      $ref: "#/components/schemas/User",
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
  "/users/latest-users": {
    get: {
      tags: ["Users"],
      summary: "Get Recently Joined Users",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "Latest users retrieved successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string", example: "success" },
                  data: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/User",
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
  "/users/promote/{id}": {
    patch: {
      tags: ["Users"],
      summary: "Promote User to be Admin",
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: "#/components/parameters/IdParam" }],
      responses: {
        200: {
          description: "User promoted to admin successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string", example: "success" },
                  data: {
                    $ref: "#/components/schemas/User",
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
  "/users/{id}": {
    parameters: [{ $ref: "#/components/parameters/IdParam" }],
    get: {
      tags: ["Users"],
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "User Details",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string", example: "success" },
                  data: {
                    $ref: "#/components/schemas/User",
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
    delete: {
      tags: ["Users"],
      security: [{ bearerAuth: [] }],
      responses: {
        204: { description: "User deleted successfully" },
        400: { $ref: "#/components/responses/BadRequest" },
        401: { $ref: "#/components/responses/Unauthorized" },
        403: { $ref: "#/components/responses/Forbidden" },
        404: { $ref: "#/components/responses/NotFound" },
        500: { $ref: "#/components/responses/ServerError" },
      },
    },
  },
};
