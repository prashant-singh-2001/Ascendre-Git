const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const JWT = require("jsonwebtoken");
const Student = require("../models/studentModel");

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token)
    return next(
      new ErrorHandler("Please log in to access this resource!", 401)
    );
  const decodedData = JWT.verify(token, process.env.JWT_SECRET);
  req.student = await Student.findById(decodedData.id);
  next();
});
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.student.role)) {
      return next(
        new ErrorHandler(
          `Role: ${req.student.role} is not allowed to access this resouce `,
          403
        )
      );
    }
    next();
  };
};
