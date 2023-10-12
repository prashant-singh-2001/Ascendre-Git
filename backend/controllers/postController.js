const express = require("express");
const sendToken = require("../utils/jwtToken");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const Post = require("../models/postModel");

exports.createPost = catchAsyncErrors(async (req, res, next) => {
  const postDetails = req.body;
  const post = await Post.create({
    ...postDetails,
    author: req.student._id,
  });
  res.status(200).json({
    success: true,
    post,
  });
});

exports.getMyPosts = catchAsyncErrors(async (req, res, next) => {
  const posts = await Post.find({ author: req.params.id });
  if (!posts) {
    return next(new ErrorHandler("No posts found", 404));
  }
  res.status(200).json({
    success: true,
    posts,
  });
});

exports.getAllPosts = catchAsyncErrors(async (req, res, next) => {
  const posts = await Post.find();
  if (!posts) {
    return next(new ErrorHandler("No posts found", 404));
  }
  res.status(200).json({
    success: true,
    posts,
  });
});
