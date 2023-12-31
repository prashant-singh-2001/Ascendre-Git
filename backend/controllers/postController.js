const express = require("express");
const sendToken = require("../utils/jwtToken");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const Post = require("../models/postModel");
const ApiFeatures = require("../utils/apiFeatures");
const LIMIT = process.env.POST_LIMIT;

// Create a new post authored by the currently authenticated student.
exports.createPost = catchAsyncErrors(async (req, res, next) => {
  // Extract post details from the request body.
  const postDetails = req.body;

  // Create a new Post document with the provided details and set the author as the currently authenticated student.
  const post = await Post.create({
    ...postDetails,
    author: req.student._id,
  });

  // Respond with a success status (200) and the created post.
  res.status(200).json({
    success: true,
    post,
  });
});

exports.getMyPosts = catchAsyncErrors(async (req, res, next) => {
  // Create an instance of ApiFeatures, passing the Post model and the query parameters
  const apiFeatures = new ApiFeatures(
    Post.find({ author: req.student._id }),
    req.query
  );

  // Sort posts by ID in descending order
  apiFeatures.query.sort({ _id: -1 });

  // Optionally, set the page and limit for pagination
  apiFeatures.pagination(LIMIT);

  // Execute the query using the exec() method
  const posts = await apiFeatures.query.exec();

  // Filter out any deleted posts from the results.
  const myPosts = posts.filter((post) => !post.isDeleted);

  if (!myPosts.length) {
    // If no posts are found, return a 404 error.
    return next(new ErrorHandler("No posts found", 404));
  }

  // Calculate the total number of posts and provide pagination information in the response.
  const total = posts.length;

  // Respond with a success status (200), the retrieved posts, and pagination details.
  res.status(200).json({
    success: true,
    myPosts,
    currentPage: Number(req.query.page || 1),
    totalPages: Math.ceil(total / LIMIT),
  });
});

// Retrieve all posts authored by students other than the currently authenticated student.
exports.getAllPosts = catchAsyncErrors(async (req, res, next) => {
  // Create an instance of ApiFeatures, passing the Post model and the query parameters
  const apiFeatures = new ApiFeatures(
    Post.find({ author: { $ne: req.body._id } }), // Exclude posts by the currently authenticated student
    req.query
  );

  // Sort posts by ID in descending order
  apiFeatures.query.sort({ _id: -1 });

  // Optionally, set the page and limit for pagination
  apiFeatures.pagination(LIMIT);

  // Execute the query using the exec() method
  const allPosts = await apiFeatures.query.exec();

  // Filter out any deleted or banned posts from the results.
  const posts = allPosts.filter((post) => !post.isDeleted && !post.isBanned);

  if (!posts.length) {
    // If no posts are found, return a 404 error.
    return next(new ErrorHandler("No posts found", 404));
  }

  // Calculate the total number of posts and provide pagination information in the response.
  const total = allPosts.length;

  // Respond with a success status (200), the retrieved posts, and pagination details.
  res.status(200).json({
    success: true,
    posts,
    currentPage: Number(req.query.page || 1),
    totalPages: Math.ceil(total / LIMIT),
  });
});

exports.getAllPostsAdmin = catchAsyncErrors(async (req, res, next) => {
  // Check if the requestor is an admin student; if not, return an unauthorized (401) error.
  if (req.student && req.student.role !== "admin") {
    return next(new ErrorHandler("Unauthorized", 401));
  }

  // Create an instance of ApiFeatures, passing the Post model and the query parameters
  const apiFeatures = new ApiFeatures(Post.find(), req.query);

  // Sort posts by ID in descending order
  apiFeatures.query.sort({ _id: -1 });

  // Calculate the total number of posts in the database
  const total = await apiFeatures.query.model.countDocuments({});

  // Optionally, set the page and limit for pagination
  apiFeatures.pagination(LIMIT);

  // Execute the query using the exec() method
  const posts = await apiFeatures.query.exec();

  if (!posts.length) {
    // If no posts are found, return a 404 error.
    return next(new ErrorHandler("No posts found", 404));
  }

  // Respond with a success status (200), the retrieved posts, and pagination details.
  res.status(200).json({
    success: true,
    posts,
    currentPage: Number(req.query.page || 1),
    totalPages: Math.ceil(total / LIMIT),
  });
});

// Update a post with the provided data, if the requestor is the author.
exports.updatePost = catchAsyncErrors(async (req, res, next) => {
  // Find the post to be updated by its ID.
  const p = await Post.findById(req.params.id);

  // Check if the requestor's ID matches the author's ID of the post; if not, return an unauthorized (401) error.
  if (!req.student._id.equals(p.author)) {
    return next(new ErrorHandler("Unauthorized", 401));
  }

  // Extract the post data from the request body.
  const postData = req.body;

  // Update the post with the new data, set isEdited to true, and update the editDate.
  const post = await Post.findByIdAndUpdate(
    req.params.id,
    { ...postData, isEdited: true, editDate: Date.now() },
    {
      new: true,
      runValidators: true,
    }
  );

  // Respond with a success status (200) and the updated post.
  res.status(200).json({
    success: true,
    post,
  });
});

// Mark a post as deleted if the requestor is the author.
exports.deletePost = catchAsyncErrors(async (req, res, next) => {
  // Find the post to be deleted by its ID.
  const p = await Post.findById(req.params.id);

  // Check if the requestor's ID matches the author's ID of the post; if not, return an unauthorized (401) error.
  if (!req.student._id.equals(p.author)) {
    return next(new ErrorHandler("Unauthorized", 401));
  }

  // Mark the post as deleted, set the deletedDate, and update it.
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

  // Respond with a success status (200) and the updated post.
  res.status(200).json({
    success: true,
    post,
  });
});

// Mark a post as banned if the requestor is an admin student.
exports.banPost = catchAsyncErrors(async (req, res, next) => {
  // Check if the requestor is an admin student; if not, return an unauthorized (401) error.
  if (req.student && req.student.role !== "admin") {
    return next(new ErrorHandler("Unauthorized", 401));
  }

  // Find the post to be banned by its ID.
  const post = await Post.findByIdAndUpdate(
    req.params.id,
    { isBanned: true, bannedDate: Date.now() },
    { new: true, runValidators: true }
  );

  // Respond with a success status (200) and the updated post.
  res.status(200).json({
    success: true,
    post,
  });
});

// Allow a student to like or unlike a post.
exports.likePost = catchAsyncErrors(async (req, res, next) => {
  // Find the post to be liked or unliked by its ID.
  const post = await Post.findById(req.params.id);

  // Check if the post exists; if not, return a not found (404) error.
  if (!post) {
    return next(new ErrorHandler("Post not found", 404));
  }

  // Create a like object with the student's ID and name.
  const like = {
    a_id: req.student._id,
    name: req.student.name,
  };

  // Check if the student has already liked the post.
  const userLikedIndex = post.likes.findIndex((l) => l.a_id.equals(like.a_id));

  if (userLikedIndex === -1) {
    // User hasn't liked the post, so add a like.
    post.likes.push(like);
  } else {
    // User has liked the post, so remove the like to "unlike" it.
    post.likes.splice(userLikedIndex, 1);
  }

  // Update the number of likes on the post.
  post.noOfLikes = post.likes.length;

  // Save the post, bypassing validation.
  await post.save({ validateBeforeSave: false });

  // Respond with a success status (200) and the updated post.
  res.status(200).json({
    success: true,
    post,
  });
});

// Allow a student to add a comment to a post.
exports.commentPost = catchAsyncErrors(async (req, res, next) => {
  // Find the post to which the comment is being added by its ID.
  const post = await Post.findById(req.params.id);

  // Check if the post exists; if not, return a not found (404) error.
  if (!post) {
    return next(new ErrorHandler("Post not found", 404));
  }

  // Create a comment object with the author's ID, name, and the comment content.
  const comment = {
    Author_ID: req.student._id,
    Author_Name: req.student.name,
    content: req.body.content,
  };

  // Add the comment to the post's comments array.
  post.comments.push(comment);

  // Update the number of comments on the post.
  post.noOfComments = post.comments.length;

  // Save the post, bypassing validation.
  await post.save({ validateBeforeSave: false });

  // Respond with a success status (200) and the updated post.
  res.status(200).json({
    success: true,
    post,
  });
});

exports.reportPost = catchAsyncErrors(async (req, res, next) => {
  const postId = req.params.id; // Get the post ID from the request parameters
  const studentId = req.student._id; // Get the ID of the student reporting the post

  try {
    // Find the post by its ID
    const post = await Post.findById(postId);

    if (!post) {
      return next(new ErrorHandler("Post not found", 404));
    }

    // Check if the student has already reported this post
    if (post.reported.includes(studentId)) {
      return next(new ErrorHandler("You have already reported this post", 400));
    }

    // Add the student's ID to the "reported" array
    post.reported.push(studentId);

    // Increment the "reported_count" by 1
    post.reported_count++;

    // Save the updated post
    await post.save();

    res.status(200).json({
      success: true,
      message: "Post reported successfully",
    });
  } catch (error) {
    next(error);
  }
});

// Get post from one club
exports.getClubPosts = catchAsyncErrors(async (req, res, next) => {
  const posts = await Post.find({ club: req.params.id });
  if (posts.length <= 0) {
    return next(new ErrorHandler("Couldn't find", 404));
  }
  res.status(200).json({
    success: true,
    posts,
  });
});

exports.getPost = catchAsyncErrors(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return next(new ErrorHandler("No post found", 404));
  }
  res.status(200).json({
    success: true,
    post,
  });
});
