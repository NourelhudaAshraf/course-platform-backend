module.exports = {
  Signup: {
    type: "object",
    required: ["name", "email", "password"],
    properties: {
      name: { type: "string", minLength: 3, maxLength: 30 },
      email: { type: "string", format: "email" },
      password: { type: "string", minLength: 8, maxLength: 30 },
    },
  },
  Login: {
    type: "object",
    required: ["email", "password"],
    properties: {
      email: { type: "string", format: "email" },
      password: { type: "string", minLength: 8, maxLength: 30 },
    },
  },
  ForgotPassword: {
    type: "object",
    required: ["email"],
    properties: {
      email: { type: "string", format: "email" },
    },
  },
  ResetPassword: {
    type: "object",
    required: ["password"],
    properties: {
      password: { type: "string", minLength: 8, maxLength: 30 },
    },
  },
  UpdatePassword: {
    type: "object",
    required: ["currentPassword", "newPassword"],
    properties: {
      currentPassword: { type: "string", minLength: 8, maxLength: 30 },
      newPassword: { type: "string", minLength: 8, maxLength: 30 },
    },
  },
};
