export const photoReferenceValidationSchema = {
  photoReference: {
    trim: true,
    notEmpty: {
      errorMessage: "Photo reference must not be empty.",
    },
  },
};
