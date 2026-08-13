module.exports = {
  "/statistics": {
    get: {
      tags: ["Statistics"],
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
                  data: {
                    type: "object",
                    properties: {
                      totalUsers: { type: "number" },
                      totalCourses: { type: "number" },
                      totalEnrollments: { type: "number" },
                      totalRevenue: { type: "number" },
                      newUsersThisMonth: { type: "number" },
                      newEnrollmentsThisMonth: { type: "number" },
                      revenueChange: { type: "number" },
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
