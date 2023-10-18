const express = require("express");
const sendToken = require("../utils/jwtToken");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const Club = require("../models/clubModel");
const Student = require("../models/studentModel");

// Create a new club
exports.createClub = catchAsyncErrors(async (req, res, next) => {
  // Extract club_name and description from the request body
  const { club_name, description } = req.body;

  // Get the ID of the admin (currently logged-in student)
  const admin = req.student._id;

  try {
    // Create a new club with the provided information
    const club = await Club.create({ club_name, description, admin });

    if (!club) {
      // If the club creation fails, return an error response
      return next(new ErrorHandler(`Cannot create club`, 500));
    }

    // Respond with a success message and the created club
    res.status(200).json({
      success: true,
      club,
    });
  } catch (error) {
    // Handle any errors that occur during club creation
    return next(error);
  }
});

// Get a list of active and non-banned clubs
exports.getClubs = catchAsyncErrors(async (req, res, next) => {
  // Find all clubs in the database
  const clubs = await Club.find();

  // Filter the clubs to include only active (not banned) clubs
  const activeClubs = clubs.filter((club) => !club.isBanned && club.isActive);

  if (!activeClubs.length) {
    // If no clubs are found, return a "Not Found" error response
    return next(new ErrorHandler(`Cannot find any clubs`, 404));
  }

  // Respond with a success message and the list of active clubs
  res.status(200).json({
    success: true,
    clubs: activeClubs,
  });
});

// Get information about a specific club by its ID
exports.getClub = catchAsyncErrors(async (req, res, next) => {
  // Find the club in the database using the provided ID
  const club = await Club.findById(req.params.id);

  if (!club || club.isBanned || !club.isActive) {
    // If the club is not found or is banned or not active, return a "Not Found" error response
    return next(
      new ErrorHandler(`Cannot find Club with ID ${req.params.id}`, 404)
    );
  }

  // Respond with a success message and the details of the found club
  res.status(200).json({
    success: true,
    club,
  });
});

// Allow a student to join a club by adding them to the club's members
exports.joinClub = catchAsyncErrors(async (req, res, next) => {
  // Find the club in the database using the provided ID
  const club = await Club.findById(req.params.id);

  if (!club || club.isBanned || !club.isActive) {
    // If the club is not found or is banned or not active, return a "Not Found" error response
    return next(
      new ErrorHandler(`Cannot find Club with ID ${req.params.id}`, 404)
    );
  }

  // Get the student making the request
  const student = req.student;

  if (club.members.includes(student._id)) {
    // If the student is already a member of the club, return a "Bad Request" error response
    return next(new ErrorHandler(`You are already a member of this club`, 400));
  }

  // Add the student's ID to the club's list of members and save the club
  club.members.push(student._id);
  await club.save();

  // Respond with a success message and the updated club details
  res.status(200).json({
    success: true,
    club,
  });
});

// Retrieve a list of members in a specific club
exports.getMembersOfClub = catchAsyncErrors(async (req, res, next) => {
  // Find the club in the database using the provided ID
  const club = await Club.findById(req.params.id);

  if (!club || club.isBanned || !club.isActive) {
    // If the club is not found or is banned or not active, return a "Not Found" error response
    return next(
      new ErrorHandler(`Cannot find Club with ID ${req.params.id}`, 404)
    );
  }

  // Find the students who are members of the club using their IDs
  const students = await Student.find({ _id: { $in: club.members } });

  // Respond with a success message and the list of students who are members of the club
  res.status(200).json({
    success: true,
    students,
  });
});

// Remove a member from a club
exports.removeMember = catchAsyncErrors(async (req, res, next) => {
  // Find the club in the database using the provided club_id
  const club = await Club.findById(req.body.club_id);

  if (!club || club.isBanned || !club.isActive) {
    // If the club is not found, is banned, or not active, return a "Not Found" error response
    return next(
      new ErrorHandler(`Cannot find Club with ID ${req.body.club_id}`, 404)
    );
  }

  // Determine the student to be removed from the club
  const student =
    req.student && req.student.role.toLowerCase() !== "admin"
      ? req.student
      : req.params.id;

  if (!club.members.includes(student)) {
    // If the student is not a member of the club, return a "Bad Request" error response
    return next(new ErrorHandler(`You are not a member of this club`, 400));
  }

  // Remove the student from the club's members
  club.members.pull(student);
  await club.save();

  // Respond with a success message and the updated club information
  res.status(200).json({
    success: true,
    club,
  });
});

exports.updateClubDetails = catchAsyncErrors(async (req, res, next) => {
  const club = await Club.findById(req.params.id);
  if (!club || club.isBanned || !club.isActive) {
    return next(
      new ErrorHandler(`Cannot find Club with id ${req.params.id}`, 404)
    );
  }
  // Check if the current user is the club's administrator
  if (!club.admin.equals(req.student._id)) {
    return next(new ErrorHandler(`Unauthorized to update this club`, 401));
  }
  // Update club details
  club.club_name = req.body.club_name;
  club.description = req.body.description;
  await club.save();
  res.status(200).json({
    success: true,
    club,
  });
});

exports.getClubsForStudent = catchAsyncErrors(async (req, res, next) => {
  const clubs = await Club.find({ members: req.student._id });
  res.status(200).json({
    success: true,
    clubs,
  });
});

exports.searchClubs = catchAsyncErrors(async (req, res, next) => {
  const { keyword } = req.query;
  const clubs = await Club.find({
    $or: [
      { club_name: { $regex: keyword, $options: "i" } }, // Case-insensitive search
      { description: { $regex: keyword, $options: "i" } },
    ],
  });
  res.status(200).json({
    success: true,
    clubs,
  });
});

exports.banClub = catchAsyncErrors(async (req, res, next) => {
  const club = await Club.findById(req.params.id);
  if (!club || !club.isActive) {
    return next(
      new ErrorHandler(`Cannot find active Club with id ${req.params.id}`, 404)
    );
  }
  // Check if the current user is an admin
  if (!req.student.role.toLowerCase() === "admin") {
    return next(new ErrorHandler(`Unauthorized to ban this club`, 401));
  }
  // Set the club as banned
  club.isBanned = true;
  await club.save();
  res.status(200).json({
    success: true,
    message: "Club has been banned",
  });
});

exports.unbanClub = catchAsyncErrors(async (req, res, next) => {
  const club = await Club.findById(req.params.id);
  if (!club || !club.isActive) {
    return next(
      new ErrorHandler(`Cannot find active Club with id ${req.params.id}`, 404)
    );
  }
  // Check if the current user is an admin
  if (!req.student.role.toLowerCase() === "admin") {
    return next(new ErrorHandler(`Unauthorized to unban this club`, 401));
  }
  // Set the club as not banned
  club.isBanned = false;
  await club.save();
  res.status(200).json({
    success: true,
    message: "Club has been unbanned",
  });
});
