const express = require("express");

const router = express.Router();

// for deployment purpose
router.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Api deployed",
  });
});

router.use("/api", require("./api"));

module.exports = router;
