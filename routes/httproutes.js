const express = require("express");
const bodyParser = require("body-parser");
const ProgressController = require("../controllers/progress");

const router = express.Router();
router.use(bodyParser.json());

// Define routes
router.get("/GetProgress", ProgressController.getProgress);
router.get("/GetAllRewards", ProgressController.getAllRewards);
router.post("/PostProgress", ProgressController.postProgress);
router.get("/", (req, res) => {
  res.send("Hello, World!");
});

module.exports = router;
