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
} = require("../controllers/clubController");
const router = express.Router();
router.use(cors());

router.route("/register").post(isAuthenticatedUser, createClub);
router.route("/getClubs").get(isAuthenticatedUser, getClubs);
router.route("/getClub/:id").get(isAuthenticatedUser, getClub);
router.route("/joinClub/:id").post(isAuthenticatedUser, joinClub);
router.route("/getMembers/:id").get(isAuthenticatedUser, getMembersOfClub);
router.route("/leaveClub/:id").get(isAuthenticatedUser, removeMember);

module.exports = router;
