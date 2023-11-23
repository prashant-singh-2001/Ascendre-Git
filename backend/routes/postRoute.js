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
  reportPost,
  getClubPosts,
  getPost,
} = require("../controllers/postController");
const router = express.Router();
router.use(cors());

// Create a new post. Requires authentication.
router.route("/").post(isAuthenticatedUser, createPost);

// Get posts created by the logged-in student.
router.route("/me/:id").get(isAuthenticatedUser, getMyPosts);

// Get all posts except those created by the logged-in student. Requires authentication.
router.route("/").get(isAuthenticatedUser, getAllPosts);

router.route("/:id").get(isAuthenticatedUser, getPost);

// Get all posts for an admin user. Requires admin authentication.
router.route("/Admin/getAllPosts").get(isAuthenticatedUser, getAllPostsAdmin);

// Update a specific post. Requires authentication.
router.route("/update/:id").post(isAuthenticatedUser, updatePost);

// Delete a specific post. Requires authentication.
router.route("/delete/:id").delete(isAuthenticatedUser, deletePost);

// Ban a specific post. Requires admin authentication.
router.route("/admin/ban/:id").post(isAuthenticatedUser, banPost);

// Like or unlike a specific post. Requires authentication.
router.route("/like/:id").post(isAuthenticatedUser, likePost);

// Add a comment to a specific post. Requires authentication.
router.route("/comment/:id").post(isAuthenticatedUser, commentPost);

// Report a post.Requires authentication.
router.route("/report/:id").post(isAuthenticatedUser, reportPost);

// Get posts for one club
router.route("/club/:id").get(isAuthenticatedUser, getClubPosts);

module.exports = router;
