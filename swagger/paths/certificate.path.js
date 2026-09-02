module.exports = {
  "/certificates/{courseId}": {
    get: {
      tags: ["Certificates"],
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: "#/components/parameters/CourseIdParam" }],
      responses: {
        200: {
          description: "Certificate Retrieved Successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string", example: "success" },
                  data: {
                    type: "object",
                    properties: {
                      _id: { type: "string" },
                      user: { type: "string" },
                      course: { type: "string" },
                      certificateNumber: { type: "string" },
                      certificateUrl: { type: "string" },
                      issuedAt: { type: "string", format: "date-time" },
                      createdAt: { type: "string", format: "date-time" },
                      updatedAt: { type: "string", format: "date-time" },
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
