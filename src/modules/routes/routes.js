const express = require("express");
const router = express.Router();

const {
  getSpend,
  postSpend,
  patchSpend,
  delSpend,
} = require("../controllers/spend.controllers");

router.get("/get", getSpend);
router.post("/post", postSpend);
router.patch("/patch", patchSpend);
router.delete("/del", delSpend);

module.exports = router;
