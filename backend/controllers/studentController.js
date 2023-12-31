const express = require("express");
const crypto = require("crypto");
const Student = require("../models/studentModel");
const sendToken = require("../utils/jwtToken");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const Post = require("../models/postModel");
const Friendship = require("../models/friendshipModel");
const sendEmail = require("../utils/sendEmail");

// Handle the creation of a new student account.
exports.createStudent = catchAsyncErrors(async (req, res, next) => {
  // Extract student information from the request body and create a new student.
  const student = await Student.create(req.body);

  // Generate and send a JSON Web Token (JWT) for the newly created student, and set HTTP status code to 201 (Created).
  sendToken(student, 201, res);
});

// Log in a student by validating their email and password.
exports.loginStudent = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if both email and password are provided.
  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Email & Password", 400));
  }

  // Find a student with the provided email and include their password for validation.
  const student = await Student.findOne({ email }).select("+password");

  // Check if a student with the provided email exists.
  if (!student) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  // Check if the student's account has been marked as deleted.
  if (student.isDeleted) {
    return next(new ErrorHandler("Your account is deleted", 401));
  }

  // Compare the provided password with the stored password to authenticate the student.
  const isPasswordMatched = await student.comparePassword(password);

  // If the password doesn't match, return an error.
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  // Generate and send a JSON Web Token (JWT) for the authenticated student, and set HTTP status code to 200 (OK).
  sendToken(student, 200, res);
});

exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const student = await Student.findOne({ email: req.body.email });

  if (!student) {
    return next(new ErrorHandler("Student not found", 404));
  }

  // Get ResetPassword Token
  const resetToken = student.getResetPasswordToken();

  await student.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

  try {
    await sendEmail({
      email: student.email,
      subject: `Ecommerce Password Recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${student.email} successfully`,
    });
  } catch (error) {
    student.resetPasswordToken = undefined;

    await student.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

// Reset Password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  // creating token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  console.log(resetPasswordToken);
  const student = await Student.findOne({
    resetPasswordToken: resetPasswordToken,
  });
  if (!student) {
    return next(
      new ErrorHandler(
        "Reset Password Token is invalid or has been expired",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not password", 400));
  }

  student.password = req.body.password;
  student.resetPasswordToken = undefined;
  await student.save();

  sendToken(student, 200, res);
});

// Retrieve a list of active students, filtering out deleted and admin accounts.
exports.getStudents = catchAsyncErrors(async (req, res, next) => {
  // Fetch all student records from the database.
  const allStudents = await Student.find();

  // Filter the students to exclude deleted accounts and those with an "admin" role.
  const students = allStudents.filter(
    (student) => !student.isDeleted && student.role.toLowerCase() !== "admin"
  );

  // Respond with a JSON object containing the list of active students and set HTTP status code to 200 (OK).
  res.status(200).json({
    success: true,
    students,
  });
});

// Retrieve a list of all students, intended for admin access only.
exports.getStudentsAdmin = catchAsyncErrors(async (req, res, next) => {
  // Check if the requesting student has admin privileges. If not, return an unauthorized error.
  if (req.student && req.student.role.toLowerCase() !== "admin") {
    return next(new ErrorHandler("Unauthorized", 401));
  }

  // Fetch all student records from the database.
  const allStudents = await Student.find();

  // Respond with a JSON object containing the list of all students and set HTTP status code to 200 (OK).
  res.status(200).json({
    success: true,
    allStudents,
  });
});

// Retrieve information about a specific student by their ID.
exports.getStudent = catchAsyncErrors(async (req, res, next) => {
  // Find a student by their provided ID.
  const student = await Student.findById(req.params.id);

  // Check if the student's account has been marked as deleted. If deleted, return an error.
  if (student.isDeleted) {
    return next(new ErrorHandler("Your account is deleted", 401));
  }

  // Respond with a JSON object containing the student's information and set HTTP status code to 200 (OK).
  res.status(200).json({
    success: true,
    student,
  });
});

exports.updateStudent = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    course: req.body.course,
    privacy: req.body.privacy,
    contact_number: req.body.contact,
  };
  // if (req.body.avatar !== "") {
  //   const user = await User.findById(req.user.id);

  //   const imageId = user.avatar.public_id;

  //   await cloudinary.v2.uploader.destroy(imageId);

  //   const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
  //     folder: "avatars",
  //     width: 150,
  //     crop: "scale",
  //   });

  //   newUserData.avatar = {
  //     public_id: myCloud.public_id,
  //     url: myCloud.secure_url,
  //   };
  // }

  await Student.findByIdAndUpdate(req.student.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

// Update a student's password.
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  // Find the student by their ID and include their password for validation.
  const student = await Student.findById(req.student.id).select("+password");

  // Check if the provided old password matches the stored password for authentication.
  const isPasswordMatched = await student.comparePassword(req.body.oldPassword);

  // If the old password doesn't match, return an error.
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old password is incorrect", 400));
  }

  // Check if the new password and confirmation match.
  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }

  // Update the student's password and save the changes.
  student.password = req.body.newPassword;
  await student.save();

  // Generate and send a JSON Web Token (JWT) for the updated student, and set HTTP status code to 200 (OK).
  sendToken(student, 200, res);
});

// Log out a student by clearing their authentication token.
exports.logoutStudent = catchAsyncErrors(async (req, res, next) => {
  // Clear the "token" cookie by setting it to null and expiring it immediately.
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  // Respond with a JSON object to confirm the successful logout and set the HTTP status code to 200 (OK).
  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

// Retrieve details of the currently logged-in student.
exports.getStudentDetails = catchAsyncErrors(async (req, res, next) => {
  // Find the student by their ID (the ID of the currently logged-in student).
  const student = await Student.findById(req.student.id);

  // Check if the student's account has been marked as deleted. If deleted, return an error.
  if (student.isDeleted) {
    return next(new ErrorHandler("Your account is deleted", 401));
  }

  // Respond with a JSON object containing the student's details and set the HTTP status code to 200 (OK).
  res.status(200).json({
    success: true,
    student,
  });
});

// Mark the currently logged-in student's account as deleted.
exports.deleteStudent = catchAsyncErrors(async (req, res, next) => {
  // Find the student by their ID (the ID of the currently logged-in student).
  const student = await Student.findById(req.student.id);

  // Mark the student's account as deleted by setting the "isDeleted" flag to true.
  student.isDeleted = true;

  // Save the changes to update the student's account status.

  await student.save();

  // Respond with a JSON object to confirm the successful account deletion and set the HTTP status code to 200 (OK).
  res.status(200).json({
    success: true,
    message: "Student Deleted",
  });
});

// Initiate a friend request between two students.
exports.friendRequest = catchAsyncErrors(async (req, res, next) => {
  // Find the sending and receiving students by their respective IDs.
  const u1 = await Student.findById(req.params._id);
  const u2 = await Student.findById(req.params.r_id);

  // Check if both sending and receiving students exist. If not, return an error.
  if (!u1 || !u2) {
    return next(new ErrorHandler("Student not found!", 401));
  } else if (u1.equals(u2)) {
    return next(
      new ErrorHandler("You cannot send a friend request to yourself!", 401)
    );
  }

  // Define sender and receiver IDs, the request date, and set the request status to pending (0).
  sender_id = req.student._id;
  reciever_id = req.params.id;
  requested_date = Date.now();
  req_status = 0;

  // Check if there is an existing Friendship record with various conditions to handle duplicates.
  const existingFriendship = await Friendship.findOne({
    $or: [
      { sender_id: sender_id, reciever_id: reciever_id, req_status: 0 },
      { sender_id: reciever_id, reciever_id: sender_id, req_status: 0 },
      { sender_id: sender_id, reciever_id: reciever_id, req_status: 1 },
      { sender_id: reciever_id, reciever_id: sender_id, req_status: 1 },
    ],
  });

  // Check if an existing friendship has already been accepted. If yes, return a message indicating it exists.
  if (existingFriendship && existingFriendship.req_status === 1) {
    res.status(200).json({
      success: true,
      message: "Friendship already exists",
    });
    return;
  }

  // Check if a friend request with the same sender and receiver is already pending. If yes, return a message indicating it's pending.
  if (existingFriendship && existingFriendship.req_status === 0) {
    res.status(200).json({
      success: true,
      message: "Friend request pending",
    });
    return;
  }

  // If no existing friendship or pending request is found, create a new Friendship record.
  await Friendship.create({
    sender_id: sender_id,
    reciever_id: reciever_id,
    requested_date: requested_date,
    req_status: req_status,
  });

  // Respond with a message to confirm that the friend request has been sent and set the HTTP status code to 200 (OK).
  res.status(200).json({
    success: true,
    message: "Request Sent",
  });
});

// Apply a front-end controller to manage the acceptance of the friend request
// Accept a friend request from another student.
exports.requestAccepted = catchAsyncErrors(async (req, res, next) => {
  // Extract the sender's ID and the receiver's ID from the request parameters.
  const senderId = req.params.id;
  const receiverId = req.student._id;

  // Find a Friendship record that matches the request conditions.
  const friendship = await Friendship.findOne({
    $or: [
      { sender_id: senderId, reciever_id: receiverId, req_status: 0 },
      { sender_id: receiverId, reciever_id: senderId, req_status: 0 },
    ],
  });

  // Check if a valid friendship request exists. If not, return an error.
  if (!friendship) {
    return next(
      new ErrorHandler(
        "Friendship request not found or has already been accepted/rejected.",
        404
      )
    );
  }

  // Update the request status to indicate that the friend request has been accepted.
  friendship.req_status = 1;
  await friendship.save();

  // Respond with a message to confirm that the friend request has been accepted and set the HTTP status code to 200 (OK).
  res.status(200).json({
    success: true,
    message: "Friend request accepted",
  });
});

// Reject a friend request from another student.
exports.requestRejected = catchAsyncErrors(async (req, res, next) => {
  // Extract the sender's ID and the receiver's ID from the request parameters.
  const senderId = req.params.id; // The ID of the student whose request is being rejected
  const receiverId = req.student._id; // The ID of the currently logged-in student

  // Find the Friendship document where the sender and receiver match and the request status is pending (0)
  const friendship = await Friendship.findOne({
    $or: [
      { sender_id: senderId, reciever_id: receiverId, req_status: 0 },
      { sender_id: receiverId, reciever_id: senderId, req_status: 0 },
    ],
  });

  // Check if a valid friendship request exists. If not, return an error.
  if (!friendship) {
    return next(
      new ErrorHandler(
        "Friendship request not found or has already been accepted/rejected.",
        404
      )
    );
  }

  // Remove the Friendship document to reject the request.
  await Friendship.findByIdAndRemove(friendship._id);

  // Respond with a message to confirm that the friend request has been rejected and set the HTTP status code to 200 (OK).
  res.status(200).json({
    success: true,
    message: "Friend request rejected",
  });
});

exports.getFriends = catchAsyncErrors(async (req, res, next) => {
  const st_id = req.student._id;
  const friendship = await Friendship.find({
    $or: [
      { reciever_id: st_id, req_status: 1 },
      { sender_id: st_id, req_status: 1 },
    ],
  });
  res.status(200).json({
    success: true,
    friendship,
  });
});

exports.getFriendRequest = catchAsyncErrors(async (req, res, next) => {
  const st_id = req.student._id;
  const requests = await Friendship.find({
    $or: [
      { reciever_id: st_id, req_status: 0 },
      { sender_id: st_id, req_status: 0 },
    ],
  });
  res.status(200).json({
    success: true,
    requests,
  });
});
