const express = require("express");
const router = express.Router();

const {
  postAppointment,
  patchAppointment,
  delAppointment,
  getPag,
} = require("../controllers/appointment.controllers.js");

router.post("/appointment/get", getPag);
router.post("/appointment/post", postAppointment);
router.patch("/appointment/patch", patchAppointment);
router.delete("/appointment/del", delAppointment);

const {
  getUser,
  postUsers,
  patchUser,
} = require("../controllers/user.controllers.js");

router.post("/user/get", getUser);
router.post("/user/post", postUsers);
router.patch("/user/patch", patchUser);

module.exports = router;
