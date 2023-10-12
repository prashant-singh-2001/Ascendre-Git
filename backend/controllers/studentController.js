const express = require("express");
const Student = require("../models/studentModel");
const sendToken = require("../utils/jwtToken");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const Post = require("../models/postModel");

exports.createStudent = catchAsyncErrors(async (req, res, next) => {
  const student = await Student.create(req.body);
  sendToken(student, 201, res);
});

// Login User
exports.loginStudent = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // checking if student has given password and email both

  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Email & Password", 400));
  }

  const student = await Student.findOne({ email }).select("+password");

  if (!student) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }
  if (student.isDeleted) {
    return next(new ErrorHandler("Your account is deleted", 401));
  }
  const isPasswordMatched = await student.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  sendToken(student, 200, res);
});

exports.getStudents = catchAsyncErrors(async (req, res, next) => {
  const allStudents = await Student.find();
  const students = allStudents.filter((student) => !student.isDeleted);
  res.status(200).json({
    success: true,
    students,
  });
});

exports.getStudent = catchAsyncErrors(async (req, res, next) => {
  const student = await Student.findById(req.params.id);
  if (student.isDeleted) {
    return next(new ErrorHandler("Your account is deleted", 401));
  }
  res.status(200).json({
    success: true,
    student,
  });
});

exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  console.log("IN");
  const student = await Student.findById(req.student.id).select("+password");

  const isPasswordMatched = await student.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old password is incorrect", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("password does not match", 400));
  }

  student.password = req.body.newPassword;

  await student.save();

  sendToken(student, 200, res);
});

exports.logoutStudent = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

exports.getStudentDetails = catchAsyncErrors(async (req, res, next) => {
  const student = await Student.findById(req.student.id);
  if (student.isDeleted) {
    return next(new ErrorHandler("Your account is deleted", 401));
  }
  res.status(200).json({
    success: true,
    student,
  });
});

exports.deleteStudent = catchAsyncErrors(async (req, res, next) => {
  const student = await Student.findById(req.student.id);
  student.isDeleted = true;
  await student.save();
  res.status(200).json({
    success: true,
    message: "Student Deleted",
  });
});


