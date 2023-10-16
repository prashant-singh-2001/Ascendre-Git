const express = require("express");
const sendToken = require("../utils/jwtToken");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const Post = require("../models/postModel");
const LIMIT = process.env.POST_LIMIT;

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
  const startAt = (Number(req.query.page || 1) - 1) * LIMIT;
  const posts = await Post.find({ author: req.student._id })
    .sort({ _id: -1 })
    .limit(LIMIT)
    .skip(startAt);
  if (!posts) {
    return next(new ErrorHandler("No posts found", 404));
  }
  const myPosts = posts.filter((post) => !post.isDeleted);
  const total = posts.length;
  res.status(200).json({
    success: true,
    myPosts,
    currentPage: Number(req.query.page || 1),
    totalPages: Math.ceil(total / LIMIT),
  });
});

exports.getAllPosts = catchAsyncErrors(async (req, res, next) => {
  const startAt = (Number(req.query.page || 1) - 1) * LIMIT;
  const allPosts = await Post.find({ author: { $ne: req.student._id } })
    .sort({ _id: -1 })
    .limit(LIMIT)
    .skip(startAt);
  if (!allPosts) {
    return next(new ErrorHandler("No posts found", 404));
  }

  const posts = allPosts.filter((post) => !post.isDeleted && !post.isBanned);
  const total = posts.length;
  res.status(200).json({
    success: true,
    posts,
    currentPage: Number(req.query.page || 1),
    totalPages: Math.ceil(total / LIMIT),
  });
});

exports.getAllPostsAdmin = catchAsyncErrors(async (req, res, next) => {
  if (req.student && req.student.role !== "admin") {
    return next(new ErrorHandler("Unauthorized", 401));
  }
  const startAt = (Number(req.query.page || 1) - 1) * LIMIT;
  const total = await Post.find().countDocuments({});
  const posts = await Post.find().sort({ _id: -1 }).limit(LIMIT).skip(startAt);
  if (!posts) {
    return next(new ErrorHandler("No posts found", 404));
  }

  res.status(200).json({
    success: true,
    posts,
    currentPage: Number(req.query.page || 1),
    totalPages: Math.ceil(total / LIMIT),
  });
});

exports.updatePost = catchAsyncErrors(async (req, res, next) => {
  const p = await Post.findById(req.params.id);
  if (!req.student._id.equals(p.author)) {
    return next(new ErrorHandler("Unauthorized", 401));
  }

  const postData = req.body;
  const post = await Post.findByIdAndUpdate(
    req.params.id,
    { ...postData, isEdited: true, editDate: Date.now() },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({
    success: true,
    post,
  });
});

exports.deletePost = catchAsyncErrors(async (req, res, next) => {
  const p = await Post.findById(req.params.id);
  if (!req.student._id.equals(p.author)) {
    return next(new ErrorHandler("Unauthorized", 401));
  }
  const post = await Post.findByIdAndUpdate(
    req.params.id,
    {
      isDeleted: true,
      deletedDate: Date.now(),
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({
    success: true,
    post,
  });
});

exports.banPost = catchAsyncErrors(async (req, res, next) => {
  if (req.student && req.student.role !== "admin") {
    return next(new ErrorHandler("Unauthorized", 401));
  }
  const post = await Post.findByIdAndUpdate(
    req.params.id,
    { isBanned: true, bannedDate: Date.now() },
    { new: true, runValidators: true }
  );
  res.status(200).json({
    success: true,
    post,
  });
});

exports.likePost = catchAsyncErrors(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return next(new ErrorHandler("Post not found", 404));
  }
  const like = {
    a_id: req.student._id,
    name: req.student.name,
  };

  const userLikedIndex = post.likes.findIndex((l) => l.a_id.equals(like.a_id));

  if (userLikedIndex === -1) {
    // User hasn't liked the post, so like it
    post.likes.push(like);
  } else {
    // User has liked the post, so unlike it
    post.likes.splice(userLikedIndex, 1);
  }

  post.noOfLikes = post.likes.length;

  await post.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    post,
  });
});

exports.commentPost = catchAsyncErrors(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return next(new ErrorHandler("Post not found", 404));
  }
  const comment = {
    Author_ID: req.student._id,
    Author_Name: req.student.name,
    content: req.body.content,
  };

  post.comments.push(comment);
  post.noOfComments = post.comments.length;

  await post.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
    post,
  });
});
