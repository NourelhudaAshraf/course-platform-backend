module.exports = {
  Enrollment: {
    type: "object",
    properties: {
      _id: { type: "string" },
      stripeSessionId: { type: "string" },
      course: {
        $ref: "#/components/schemas/Course",
      },
      createdAt: { type: "string" },
      paymentStatus: { type: "string" },
      price: { type: "number" },
      user: { type: "string" },
    },
  },
};
