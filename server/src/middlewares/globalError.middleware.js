// middlewares/errorHandler.js

export const errorHandler = (err, req, res, next) => {
  console.error("🔥 Global Error Handler:", err);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    // Only show stack trace in development
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
