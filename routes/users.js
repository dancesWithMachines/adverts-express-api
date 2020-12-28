const express = require("express")
const router = express.Router();
const mongoose = require("mongoose")
const checkAuth = require("../middleware/AuthCheck")
const removeAdverts = require("../middleware/RemoveAdverts")
const userController = require("../controllers/usersController")

router.post("/register", userController.registerUser)

router.delete("/:id", checkAuth, removeAdverts, userController.deleteUser)

router.post("/login", userController.logIn)

module.exports = router