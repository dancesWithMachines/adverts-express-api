const express = require("express")
const mongoose = require("mongoose")
const Advert = require("../models/Advert")
const checkAuth = require("../middleware/AuthChecker")
const router = express.Router()
const multer = require("multer")

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

router.get("/", (req,res) => {
    Advert.find()
        .then(result => {
            res.status(200).json(result)
        })
        .catch( err => {
            res.status(204).json({message: err})
            console.log(err)
        })
})

router.get("/:id", (req, res) => {
    Advert.findById(req.params.id)
        .then(result => {
            res.status(200).json(result)
        })
        .catch( err => {
            res.status(404).json({message: err})
            console.log(err)
        })
})
router.post("/", checkAuth, (req,res) => {
    const advert = new Advert({
        _id: new mongoose.Types.ObjectId,
        owner: req.body.owner,
        title: req.body.title,
        description: req.body.description,
        imageUrl: req.body.imageUrl
    })

    advert.save()
        .then(data => {
            res.status(201).json(data)
        })
        .catch( (err) =>{
            res.status(400).json({message: err})
            console.log(err)
        })
        
})

router.patch("/id", checkAuth, (req,res) => {
    const id = req.params.id
    const advert = new Advert({
        title: req.body.title,
        description: req.body.description,
        imageUrl: req.body.imageUrl
    })
    Advert.findByIdAndUpdate(id, {title: advert.title, description: advert.description, imageUrl: advert.imageUrl})
        .then(response => {
            res.status(204).json({
                message: "Advert id " + id + " has been updatet successfully",
                info: response
            })
        })
})

router.delete("/id", checkAuth, (req, res) =>{
    const id = req.params.id
    Advert.findByIdAndDelete(id)
        .then(response => {
            res.status(200).json({
                message: "Product id " + id + " removed succesfully",
                info: response
            })
        })
        .catch((err) => res.status(500).json({error: err}))
})

module.exports = router