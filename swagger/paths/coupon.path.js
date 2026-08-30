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
                    $ref: "#/components/schemas/Coupon",
                  },
                },
              }
            : {
                data: { $ref: "#/components/schemas/Coupon" },
              }),
        },
      },
    },
  },
});

module.exports = {
  "/coupons/validate": {
    post: {
      tags: ["Coupons"],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/validateCoupon",
            },
          },
        },
      },
      responses: {
        200: successResponse("Coupon valid"),
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
  "/coupons": {
    get: {
      tags: ["Coupons"],
      security: [{ bearerAuth: [] }],
      parameters: [
        { $ref: "#/components/parameters/PageQuery" },
        { $ref: "#/components/parameters/LimitQuery" },
        { $ref: "#/components/parameters/SortQuery" },
      ],
      responses: {
        200: successResponse("List of coupons", true),
        400: { $ref: "#/components/responses/BadRequest" },
        401: { $ref: "#/components/responses/Unauthorized" },
        403: { $ref: "#/components/responses/Forbidden" },
        500: { $ref: "#/components/responses/ServerError" },
      },
    },
    post: {
      tags: ["Coupons"],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/CreateCoupon",
            },
          },
        },
      },
      responses: {
        201: successResponse("Coupon created successfully"),
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
  "/coupons/{id}": {
    parameters: [{ $ref: "#/components/parameters/IdParam" }],
    get: {
      tags: ["Coupons"],
      security: [{ bearerAuth: [] }],
      responses: {
        200: successResponse("Coupon details"),
        400: { $ref: "#/components/responses/BadRequest" },
        404: { $ref: "#/components/responses/NotFound" },
        500: { $ref: "#/components/responses/ServerError" },
      },
    },
    patch: {
      tags: ["Coupons"],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/UpdateCoupon",
            },
          },
        },
      },
      responses: {
        200: successResponse("Coupon updated successfully"),
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
      tags: ["Coupons"],
      security: [{ bearerAuth: [] }],
      responses: {
        204: { description: "Coupon deleted successfully" },
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
