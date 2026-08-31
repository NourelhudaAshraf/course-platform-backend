const successResponse = (description, isArrayData) => ({
  description,
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          status: { type: "string", example: "success" },
          ...(isArrayData
            ? {
                results: { type: "number" },
                totalPages: { type: "number" },
                page: { type: "number" },
                data: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Course",
                  },
                },
              }
            : {
                data: { $ref: "#/components/schemas/Course" },
              }),
        },
      },
    },
  },
});
module.exports = {
  "/courses/publish": {
    get: {
      tags: ["Courses"],
      summary: "Get published courses",
      parameters: [
        { $ref: "#/components/parameters/PageQuery" },
        { $ref: "#/components/parameters/LimitQuery" },
        { $ref: "#/components/parameters/SortQuery" },
        { $ref: "#/components/parameters/TitleQuery" },
        { $ref: "#/components/parameters/MinPriceQuery" },
        { $ref: "#/components/parameters/MaxPriceQuery" },
      ],
      responses: {
        200: successResponse("List of published courses", true),
        400: { $ref: "#/components/responses/BadRequest" },
        500: { $ref: "#/components/responses/ServerError" },
      },
    },
  },
  "/courses/publish/{id}": {
    parameters: [{ $ref: "#/components/parameters/IdParam" }],
    get: {
      tags: ["Courses"],
      summary: "Get published course details",
      responses: {
        200: successResponse("List of published courses", true),
        400: { $ref: "#/components/responses/BadRequest" },
        404: { $ref: "#/components/responses/NotFound" },
        500: { $ref: "#/components/responses/ServerError" },
      },
    },
    patch: {
      tags: ["Courses"],
      security: [{ bearerAuth: [] }],
      summary: "Admin can publish course",
      responses: {
        200: successResponse("Course published successfully"),
        400: {
          $ref: "#/components/responses/BadRequest",
        },
        401: { $ref: "#/components/responses/Unauthorized" },
        403: { $ref: "#/components/responses/Forbidden" },
        404: { $ref: "#/components/responses/NotFound" },
        500: {
          $ref: "#/components/responses/ServerError",
        },
      },
    },
  },
  "/courses/un-publish/{id}": {
    parameters: [{ $ref: "#/components/parameters/IdParam" }],
    patch: {
      tags: ["Courses"],
      security: [{ bearerAuth: [] }],
      summary: "Admin can move course to draft",
      responses: {
        200: successResponse("Course moved to draft successfully"),
        400: {
          $ref: "#/components/responses/BadRequest",
        },
        401: { $ref: "#/components/responses/Unauthorized" },
        403: { $ref: "#/components/responses/Forbidden" },
        404: { $ref: "#/components/responses/NotFound" },
        500: {
          $ref: "#/components/responses/ServerError",
        },
      },
    },
  },
  "/courses": {
    get: {
      tags: ["Courses"],
      summary: "Get all courses for admins (Published, Draft)",
      security: [{ bearerAuth: [] }],
      parameters: [
        { $ref: "#/components/parameters/CourseStatusQuery" },
        { $ref: "#/components/parameters/PageQuery" },
        { $ref: "#/components/parameters/LimitQuery" },
        { $ref: "#/components/parameters/SortQuery" },
        { $ref: "#/components/parameters/TitleQuery" },
        { $ref: "#/components/parameters/MinPriceQuery" },
        { $ref: "#/components/parameters/MaxPriceQuery" },
      ],
      responses: {
        200: successResponse("List of courses", true),
        400: { $ref: "#/components/responses/BadRequest" },
        401: { $ref: "#/components/responses/Unauthorized" },
        403: { $ref: "#/components/responses/Forbidden" },
        500: { $ref: "#/components/responses/ServerError" },
      },
    },
    post: {
      tags: ["Courses"],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              $ref: "#/components/schemas/CreateCourse",
            },
          },
        },
      },
      responses: {
        201: successResponse("Course created successfully"),
        400: {
          $ref: "#/components/responses/BadRequest",
        },
        401: { $ref: "#/components/responses/Unauthorized" },
        403: { $ref: "#/components/responses/Forbidden" },
        500: {
          $ref: "#/components/responses/ServerError",
        },
      },
    },
  },
  "/courses/{id}": {
    parameters: [{ $ref: "#/components/parameters/IdParam" }],
    get: {
      tags: ["Courses"],
      security: [{ bearerAuth: [] }],
      summary: "Get course details for admins",
      responses: {
        200: successResponse("Course details"),
        400: { $ref: "#/components/responses/BadRequest" },
        401: { $ref: "#/components/responses/Unauthorized" },
        403: { $ref: "#/components/responses/Forbidden" },
        404: { $ref: "#/components/responses/NotFound" },
        500: { $ref: "#/components/responses/ServerError" },
      },
    },
    patch: {
      tags: ["Courses"],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              $ref: "#/components/schemas/UpdateCourse",
            },
          },
        },
      },
      responses: {
        200: successResponse("Course updated successfully"),
        400: {
          $ref: "#/components/responses/BadRequest",
        },
        401: { $ref: "#/components/responses/Unauthorized" },
        403: { $ref: "#/components/responses/Forbidden" },
        500: {
          $ref: "#/components/responses/ServerError",
        },
      },
    },
    delete: {
      tags: ["Courses"],
      security: [{ bearerAuth: [] }],
      responses: {
        204: { description: "Course deleted successfully" },
        400: {
          $ref: "#/components/responses/BadRequest",
        },
        401: { $ref: "#/components/responses/Unauthorized" },
        403: { $ref: "#/components/responses/Forbidden" },
        404: { $ref: "#/components/responses/NotFound" },
        500: {
          $ref: "#/components/responses/ServerError",
        },
      },
    },
  },
};
