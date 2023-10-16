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
} = require("../controllers/studentController");
const { isAuthenticatedUser } = require("../middlewares/auth");
const router = express.Router();
router.use(cors());

router.route("/register").post(createStudent);
router.route("/login").post(loginStudent);
router.route("/logout").post(logoutStudent);
router.route("/students").get(getStudents);
router.route("/Admin/students").get(getStudentsAdmin);
router.route("/getStudent/:id").get(getStudent);
router.route("/password/change").put(isAuthenticatedUser, updatePassword);
router.route("/me").get(isAuthenticatedUser, getStudentDetails);
router.route("/delete/me").delete(isAuthenticatedUser, deleteStudent);
router
  .route("/friendRequests/send/:id")
  .post(isAuthenticatedUser, friendRequest);
router
  .route("/friendRequests/accepted/:id")
  .post(isAuthenticatedUser, requestAccepted);
router
  .route("/friendRequests/rejected/:id")
  .post(isAuthenticatedUser, requestRejected);

module.exports = router;
