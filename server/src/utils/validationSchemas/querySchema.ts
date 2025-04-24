export const queryValidationSchema = {
  query: {
    trim: true,
    notEmpty: {
      errorMessage: "Query must not be empty",
    },
    isLength: {
      options: { min: 8 },
      errorMessage: "Query must be at least 3 characters in length.",
    },
    escape: true,
  },
};
