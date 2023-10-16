const express = require("express");
const cors = require("cors");
const { isAuthenticatedUser } = require("../middlewares/auth");
const {
  createPost,
  getMyPosts,
  getAllPosts,
  getAllPostsAdmin,
  updatePost,
  deletePost,
  banPost,
  likePost,
  commentPost,
} = require("../controllers/postController");
const router = express.Router();
router.use(cors());

router.route("/create").post(isAuthenticatedUser, createPost);
router.route("/me/:id").get(isAuthenticatedUser, getMyPosts);
router.route("/getAllPosts").get(isAuthenticatedUser, getAllPosts);
router.route("/Admin/getAllPosts").get(isAuthenticatedUser, getAllPostsAdmin);
router.route("/update/:id").post(isAuthenticatedUser, updatePost);
router.route("/delete/:id").post(isAuthenticatedUser, deletePost);
router.route("/admin/ban/:id").post(isAuthenticatedUser, banPost);
router.route("/like/:id").post(isAuthenticatedUser, likePost);
router.route("/comment/:id").post(isAuthenticatedUser, commentPost);

module.exports = router;
