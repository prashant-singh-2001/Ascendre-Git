const express = require("express");
const cors = require("cors");
const { isAuthenticatedUser } = require("../middlewares/auth");
const { model } = require("mongoose");
const {
  createPost,
  getMyPosts,
  getAllPosts,
} = require("../controllers/postController");
const router = express.Router();
router.use(cors());

router.route("/create").post(isAuthenticatedUser, createPost);
router.route("/me/:id").get(isAuthenticatedUser, getMyPosts);
router.route("/getAllPosts").get(isAuthenticatedUser, getAllPosts);

module.exports = router;
