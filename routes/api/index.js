const express = require("express");
const router = express.Router();

const userController = require("../../controllers/api/userController");
// create user
router.post("/create-user", userController.createUser);
// authenticate user
router.post("/authenticate", userController.authenticateUser);

module.exports = router;
