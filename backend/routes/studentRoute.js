const express = require("express");
const cors = require("cors");
const {
  createStudent,
  getStudents,
  getStudent,
  loginStudent,
  updatePassword,
  logoutStudent,
  getStudentDetails,
  deleteStudent,
  getStudentsAdmin,
  friendRequest,
  requestAccepted,
  requestRejected,
  getFriends,
  getFriendRequest,
  forgotPassword,
  resetPassword,
  updateStudent,
} = require("../controllers/studentController");
const { isAuthenticatedUser } = require("../middlewares/auth");
const router = express.Router();
router.use(cors());

// Student Registration
router.route("/").post(createStudent);

// Update Student
router.route("/").put(isAuthenticatedUser, updateStudent);

// Student Login
router.route("/login").post(loginStudent);

// Student Logout
router.route("/logout").post(logoutStudent);

router.route("/password/").post(forgotPassword);

router.route("/password/reset/:token").put(resetPassword);

// Get List of Non-Deleted Non-Admin Students
router.route("/students").get(getStudents);

// Get List of All Students (Admin Access)
router.route("/Admin/students").get(getStudentsAdmin);

// Get Student Details by ID
router.route("/getStudent/:id").get(getStudent);

// Change Student Password (Authenticated User)
router.route("/password/").put(isAuthenticatedUser, updatePassword);

// Get Details of Currently Authenticated Student
router.route("/").get(isAuthenticatedUser, getStudentDetails);

// Delete Currently Authenticated Student's Account
router.route("/delete/me").delete(isAuthenticatedUser, deleteStudent);

// Send Friend Request to Student by ID
router
  .route("/friendRequests/send/:id")
  .post(isAuthenticatedUser, friendRequest);

// Accept Friend Request from Student by ID
router
  .route("/friendRequests/accepted/:id")
  .post(isAuthenticatedUser, requestAccepted);

// Reject Friend Request from Student by ID
router
  .route("/friendRequests/rejected/:id")
  .post(isAuthenticatedUser, requestRejected);
// Get Friends
router.route("/friends").get(isAuthenticatedUser, getFriends);

// Get all friend requests
router.route("/friendRequests").get(isAuthenticatedUser, getFriendRequest);

module.exports = router;
