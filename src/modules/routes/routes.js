const express = require("express");
const router = express.Router();

const {
  getAppointment,
  postAppointment,
  patchAppointment,
  delAppointment,
} = require("../controllers/appointment.controllers.js");

router.get("/appointment/get", getAppointment);
router.post("/appointment/post", postAppointment);
// router.patch("/appointment/patch", patchAppointment);
router.delete("/appointment/del", delAppointment);

const {
  getUser,
  postUsers,
  patchUsers,
  delUsers,
} = require("../controllers/user.controllers.js");

router.get("/user/get", getUser);
router.post("/user/post", postUsers);
// router.patch("/user/patch", patchUsers);
// router.delete("/user/del", delUsers);

module.exports = router;
