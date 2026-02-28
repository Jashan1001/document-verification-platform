export const successResponse = (
  data: any,
  message?: string
) => ({
  success: true,
  data,
  message,
});

export const errorResponse = (
  message: string
) => ({
  success: false,
  message,
});