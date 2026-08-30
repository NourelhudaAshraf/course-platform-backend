module.exports = {
  Coupon: {
    type: "object",
    properties: {
      _id: { type: "string" },
      code: {
        type: "string",
      },
      percentage: {
        type: "number",
      },
      startDate: {
        type: "string",
        format: "date-time",
      },
      expiryDate: {
        type: "string",
        format: "date-time",
      },
      usageLimit: {
        type: "integer",
      },
      usedCount: {
        type: "integer",
      },
      isActive: {
        type: "boolean",
      },
      createdAt: {
        type: "string",
        format: "date-time",
      },
      updatedAt: {
        type: "string",
        format: "date-time",
      },
    },
  },
  CreateCoupon: {
    type: "object",
    required: ["code", "percentage", "expiryDate"],
    properties: {
      code: {
        type: "string",
        minLength: 3,
        maxLength: 30,
        example: "WELCOME20",
      },
      percentage: {
        type: "number",
        minimum: 1,
        maximum: 100,
        example: 20,
      },
      startDate: {
        type: "string",
        format: "date-time",
        example: "2026-08-30T00:00:00.000Z",
      },
      expiryDate: {
        type: "string",
        format: "date-time",
        example: "2026-12-31T23:59:59.000Z",
      },
      usageLimit: {
        type: "integer",
        minimum: 1,
        nullable: true,
        example: 100,
      },
      isActive: {
        type: "boolean",
        example: true,
      },
    },
  },
  UpdateCoupon: {
    type: "object",
    properties: {
      code: {
        type: "string",
        minLength: 3,
        maxLength: 30,
        example: "WELCOME25",
      },
      percentage: {
        type: "number",
        minimum: 1,
        maximum: 100,
        example: 25,
      },
      startDate: {
        type: "string",
        format: "date-time",
      },
      expiryDate: {
        type: "string",
        format: "date-time",
      },
      usageLimit: {
        type: "integer",
        minimum: 1,
        nullable: true,
        example: 200,
      },
      isActive: {
        type: "boolean",
        example: true,
      },
    },
  },
  validateCoupon: {
    type: "object",
    required: ["code", "courseId"],
    properties: {
      code: {
        type: "string",
        minLength: 3,
        maxLength: 30,
        example: "WELCOME25",
      },
      courseId: {
        type: "string",
        pattern: "^[a-fA-F0-9]{24}$",
      },
    },
  },
};
