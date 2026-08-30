module.exports = {
  IdParam: {
    name: "id",
    in: "path",
    required: true,
    description: "MongoDB ObjectId",
    schema: { type: "string", pattern: "^[a-fA-F0-9]{24}$" },
  },
  CourseIdParam: {
    name: "courseId",
    in: "path",
    required: true,
    description: "MongoDB ObjectId",
    schema: { type: "string", pattern: "^[a-fA-F0-9]{24}$" },
  },
  ResetTokenParam: {
    name: "token",
    in: "path",
    required: true,
    description: "Password reset token",
    schema: { type: "string", minLength: 64, maxLength: 64 },
  },
  PageQuery: {
    name: "page",
    in: "query",
    schema: { type: "integer", minimum: 1, default: 1 },
  },
  LimitQuery: {
    name: "limit",
    in: "query",
    schema: { type: "integer", minimum: 1, maximum: 25, default: 10 },
  },
  SortQuery: {
    name: "sort",
    in: "query",
    description: "Comma-separated fields; prefix with - for descending",
    schema: { type: "string", example: "-createdAt" },
  },
  TitleQuery: {
    name: "title",
    in: "query",
    description: "Filter by course title",
    schema: { type: "string", maxLength: 100 },
  },
  MinPriceQuery: {
    name: "minPrice",
    in: "query",
    schema: { type: "number", minimum: 0 },
  },
  MaxPriceQuery: {
    name: "maxPrice",
    in: "query",
    schema: { type: "number", minimum: 0 },
  },
  SearchUserQuery: {
    name: "searchUser",
    in: "query",
    description: "Search by name or email",
    schema: { type: "string", maxLength: 100 },
  },
};
