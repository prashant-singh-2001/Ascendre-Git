const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  image: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  author: {
    type: mongoose.Schema.ObjectId,
    ref: "Student",
    required: true,
  },
  comments: [
    {
      Author_ID: {
        type: mongoose.Schema.ObjectId,
        ref: "Student",
        required: true,
      },
      Author_Name: {
        type: String,
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
    },
  ],
  noOfComments: {
    type: Number,
    default: 0,
  },
  likes: [
    {
      a_id: {
        type: mongoose.Schema.ObjectId,
        ref: "Student",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
    },
  ],
  noOfLikes: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isEdited: {
    type: Boolean,
    default: false,
  },
  editDate: {
    type: Date,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  deletedDate: {
    type: Date,
  },
  isBanned: {
    type: Boolean,
    default: false,
  },
  bannedDate: {
    type: Date,
  },
});

module.exports = mongoose.model("Post", postSchema);
