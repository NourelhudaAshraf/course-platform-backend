module.exports = {
  CreateCourse: {
    type: "object",
    required: ["title", "description", "price", "image"],
    properties: {
      title: { type: "string", minLength: 3, maxLength: 100 },
      description: { type: "string", minLength: 8, maxLength: 1000 },
      price: { type: "number", minimum: 0.01 },
      image: { type: "string", format: "binary" },
    },
  },
  UpdateCourse: {
    type: "object",
    properties: {
      title: { type: "string", minLength: 3, maxLength: 100 },
      description: { type: "string", minLength: 8, maxLength: 1000 },
      price: { type: "number", minimum: 0.01 },
      image: { type: "string", format: "binary" },
    },
  },
  Course: {
    type: "object",
    properties: {
      _id: { type: "string" },
      title: { type: "string" },
      description: { type: "string" },
      price: { type: "number" },
      image: { type: "string" },
      user: {
        type: "object",
        properties: {
          _id: { type: "string" },
          name: { type: "string" },
        },
      },
      createdAt: { type: "string" },
    },
  },
};
