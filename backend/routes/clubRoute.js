const express = require("express");
const cors = require("cors");
const { isAuthenticatedUser } = require("../middlewares/auth");
const {
  getClubs,
  getClub,
  createClub,
  joinClub,
  getMembersOfClub,
  removeMember,
  updateClubDetails,
  getClubsForStudent,
  banClub,
  unbanClub,
  deactivateClub,
} = require("../controllers/clubController");
const router = express.Router();
router.use(cors());

router.route("/register").post(isAuthenticatedUser, createClub);
router.route("/getClubs").get(getClubs);
router.route("/getClub/:id").get(isAuthenticatedUser, getClub);
router.route("/getStudentsClubs").post(getClubsForStudent);
router.route("/joinClub/:id").post(isAuthenticatedUser, joinClub);
router.route("/getMembers/:id").get(isAuthenticatedUser, getMembersOfClub);
router.route("/leaveClub/:id").delete(isAuthenticatedUser, removeMember);
router.route("/updateClub/:id").put(isAuthenticatedUser, updateClubDetails);
router.route("/banClub/:id").delete(isAuthenticatedUser, banClub);
router.route("/unbanClub/:id").patch(isAuthenticatedUser, unbanClub);
router.route("/deactivate/:id").delete(isAuthenticatedUser, deactivateClub);
module.exports = router;
