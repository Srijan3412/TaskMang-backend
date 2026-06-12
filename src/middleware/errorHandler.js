import env from "../config/env.js";
import ApiError from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
  let error = err;

  // If error is not an instance of ApiError, wrap it
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";
    error = new ApiError(statusCode, message, [], err.stack);
  }

  const response = {
    success: false,
    message: error.message,
    errors: error.errors || [],
    ...(env.NODE_ENV === "development" && { stack: error.stack }),
  };

  res.status(error.statusCode).json(response);
};

export default errorHandler;
