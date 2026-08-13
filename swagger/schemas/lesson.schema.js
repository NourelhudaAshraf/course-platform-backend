module.exports = {
  CreateLesson: {
    type: "object",
    required: ["title", "description", "video", "order"],
    properties: {
      title: { type: "string", minLength: 3, maxLength: 100 },
      description: { type: "string", minLength: 8, maxLength: 1000 },
      video: { type: "string", format: "binary" },
      order: { type: "number", minimum: 1 },
    },
  },
  UpdateLesson: {
    type: "object",
    properties: {
      title: { type: "string", minLength: 3, maxLength: 100 },
      description: { type: "string", minLength: 8, maxLength: 1000 },
      video: { type: "string", format: "binary" },
      order: { type: "number", minimum: 1 },
    },
  },
  WatchLesson: {
    type: "object",
    required: ["lessonId", "lastPosition"],
    properties: {
      lessonId: { type: "string", pattern: "^[a-fA-F0-9]{24}$" },
      lastPosition: { type: "number", minimum: 0 },
    },
  },
  GeneralLesson: {
    type: "object",
    properties: {
      _id: { type: "string" },
      title: { type: "string" },
      description: { type: "string" },
      course: {
        type: "object",
        properties: {
          _id: { type: "string" },
          title: { type: "string" },
        },
      },
      order: { type: "number" },
      createdAt: { type: "string" },
    },
  },
  Lesson: {
    type: "object",
    properties: {
      _id: { type: "string" },
      title: { type: "string" },
      description: { type: "string" },
      videoUrl: { type: "string" },
      totalSeconds: { type: "number" },
      course: {
        type: "object",
        properties: {
          _id: { type: "string" },
          title: { type: "string" },
        },
      },
      order: { type: "number" },
      createdAt: { type: "string" },
    },
  },
};
