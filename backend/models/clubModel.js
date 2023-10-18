const mongoose = require("mongoose");

const club = new mongoose.Schema({
  club_name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    maxLen: 300,
    required: true,
  },
  admin: {
    type: mongoose.Schema.ObjectId,
    ref: "student",
    required: true,
  },
  members: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "student",
      required: true,
    },
  ],
  post: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "post",
      required: true,
    },
  ],
  created_on: {
    type: Date,
    required: true,
    default: Date.now,
  },
  report: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "student",
      required: true,
    },
  ],
  report: {
    type: Number,
    required: true,
    default: 0,
  },
  isBanned: {
    type: Boolean,
  },
  bannedDate: {
    type: Date,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Club", club);
