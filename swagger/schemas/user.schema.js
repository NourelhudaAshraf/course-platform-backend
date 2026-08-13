module.exports = {
  UpdateUser: {
    type: "object",
    properties: {
      name: { type: "string", minLength: 3, maxLength: 30 },
      email: { type: "string", format: "email" },
    },
  },
  User: {
    type: "object",
    properties: {
      _id: { type: "string" },
      name: { type: "string" },
      email: { type: "string" },
      role: { type: "string" },
      createdAt: { type: "string" },
    },
  },
};
