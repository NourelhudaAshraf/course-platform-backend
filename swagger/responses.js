const errorResponse = (description) => ({
  description,
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          status: { type: "string", example: "error" },
          message: { type: "string" },
        },
      },
    },
  },
});

module.exports = {
  BadRequest: errorResponse("Bad request"),
  Unauthorized: errorResponse("Unauthorized"),
  Forbidden: errorResponse("Forbidden"),
  NotFound: errorResponse("Not found"),
  ServerError: errorResponse("Internal server error"),
};
