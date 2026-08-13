const successResponse = (description, isUserData) => ({
  description,
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          status: { type: "string", example: "success" },
          ...(isUserData
            ? {
                data: { $ref: "#/components/schemas/User" },
              }
            : {
                message: { type: "string" },
              }),
        },
      },
    },
  },
});
module.exports = {
  "/auth/signup": {
    post: {
      tags: ["Authentication"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Signup",
            },
          },
        },
      },
      responses: {
        201: successResponse("Signup successful", true),
        400: {
          $ref: "#/components/responses/BadRequest",
        },
      },
    },
  },
  "/auth/login": {
    post: {
      tags: ["Authentication"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Login",
            },
          },
        },
      },
      responses: {
        200: successResponse("Login successful", true),
        400: {
          $ref: "#/components/responses/BadRequest",
        },
        401: { $ref: "#/components/responses/Unauthorized" },
      },
    },
  },
  "/auth/forgot-password": {
    post: {
      tags: ["Authentication"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/ForgotPassword",
            },
          },
        },
      },
      responses: {
        200: successResponse("Email sent successfully"),
        404: {
          $ref: "#/components/responses/NotFound",
        },
        500: {
          $ref: "#/components/responses/ServerError",
        },
      },
    },
  },
  "/auth/reset-password/{token}": {
    post: {
      tags: ["Authentication"],
      parameters: [{ $ref: "#/components/parameters/ResetTokenParam" }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/ResetPassword",
            },
          },
        },
      },
      responses: {
        200: successResponse("Password reset successfully"),
        400: {
          $ref: "#/components/responses/BadRequest",
        },
        500: {
          $ref: "#/components/responses/ServerError",
        },
      },
    },
  },
  "/auth/update-password": {
    patch: {
      tags: ["Authentication"],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/UpdatePassword",
            },
          },
        },
      },
      responses: {
        200: successResponse("Password updated successfully"),
        400: {
          $ref: "#/components/responses/BadRequest",
        },
        500: {
          $ref: "#/components/responses/ServerError",
        },
      },
    },
  },
  "/auth/me": {
    get: {
      tags: ["Authentication"],
      summary: "Get Information of current user",
      security: [{ bearerAuth: [] }],
      responses: {
        200: successResponse("User information", true),
        401: { $ref: "#/components/responses/Unauthorized" },
        500: { $ref: "#/components/responses/ServerError" },
      },
    },
  },
  "/auth/logout": {
    post: {
      tags: ["Authentication"],
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "Logout successful",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string", example: "success" },
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
};
