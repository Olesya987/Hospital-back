const express = require("express");
const router = express.Router();

const {
  postAppointment,
  patchAppointment,
  delAppointment,
  getPag,
  sortAppointment,
} = require("../controllers/appointment.controllers.js");

router.get("/appointment/get/:currentPage/:rowsOnPage", getPag);
router.post("/appointment/sort/:currentPage/:rowsOnPage", sortAppointment);
router.post("/appointment/post", postAppointment);
router.patch("/appointment/patch", patchAppointment);
router.delete("/appointment/del", delAppointment);

const {
  getUser,
  postUsers,
} = require("../controllers/user.controllers.js");

router.post("/user/get", getUser);
router.post("/user/post", postUsers);

module.exports = router;
