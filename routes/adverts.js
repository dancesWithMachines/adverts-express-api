const express = require("express")
const mongoose = require("mongoose")
const Advert = require("../models/Advert")
const checkAuth = require("../middleware/AuthCheck")
const router = express.Router()
const multer = require("multer")

const advertsController = require("../controllers/advertsController")

// Multer

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      cb(null, new Date().toISOString().replace(":", "_").replace(":","_") + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype ===  "image/png"){
      cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({storage: storage, limits: {fileSize: 1024 * 1024 * 5}, fileFilter: fileFilter})

// Routing

//Returns all adverts
router.get("/", advertsController.getAllAdverts)

//Returns user's adverts
router.get("/user/:owner", advertsController.getUserAdverts)

//Returns single advert
router.get("/:id", advertsController.getAdvertById)

//Adds advert
router.post("/", upload.single("advertImage"), checkAuth, advertsController.addAdvert)

//Patches selected advert
router.patch("/:id", upload.single("advertImage"), checkAuth, advertsController.patchAdvert)

//Deletes advert
router.delete("/:id", checkAuth, advertsController.removeAdvert)

module.exports = router