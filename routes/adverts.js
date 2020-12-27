const express = require("express")
const mongoose = require("mongoose")
const Advert = require("../models/Advert")
const checkAuth = require("../middleware/AuthCheck")
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

//Returns all adverts
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


//Returns user's adverts
router.get("/user/:owner", (req, res) => {
    console.log("\x1b[34m", req.params.owner)
    Advert.find({owner: req.params.owner})
        .then(result => {
            if (result != null)
                res.status(200).json(result)
            else
                res.status(404).json({message: "Did not find any adverts"})
        })
        .catch( err => {
            res.status(204).json({message: err})
            console.log(err)
        })
})

//Returns single advert
router.get("/:id", (req, res) => {
    Advert.findById(req.params.id)
        .then(result => {
            if (result != null)
                res.status(200).json(result)
            else
                res.status(404).json({messgae: "Advert id " + req.params.id + " does not exsits"})
        })
        .catch( err => {
            res.status(404).json({message: err})
            console.log("\x1b[41m",err)
        })
})

//Adds advert
router.post("/", upload.single("advertImage"), checkAuth, (req,res) => {
    var filepath = ""
    try{
        filepath = req.file.path
    } catch {}
    const advert = new Advert({
        _id: new mongoose.Types.ObjectId,
        owner: req.decoded.email,
        title: req.body.title,
        description: req.body.description,
        imageUrl: filepath
    })
    
    advert.save()
        .then(data => {
            res.status(201).json(data)
        })
        .catch( (err) =>{
            res.status(400).json({message: err})
            console.log("\x1b[41m",err)
        })
        
})

//Patches selected advert
router.patch("/:id", upload.single("advertImage"), checkAuth, (req,res) => {
    const id = req.params.id
    const advert = new Advert({
        title: req.body.title,
        description: req.body.description,
        imageUrl: req.file.path
    })
    Advert.findById(id)
        .then(result => {
            if (result != null){
                if (result.owner == req.decoded.email){
                    Advert.findByIdAndUpdate(id, {title: advert.title, description: advert.description, imageUrl: advert.imageUrl})
                        .then(response => {
                            res.status(200).json({
                                message: "Advert id " + id + " has been updated successfully",
                                info: response
                            })
                        })
                        .catch( (err) =>{
                            res.status(400).json({message: err})
                            console.log(err)
                        })
                } else
                    res.status(403).json({message: "Unauthenticated"})               
            } else 
                res.status(404).json({message: "No such advert"})
        })
        .catch( (err) =>{
            res.status(500).json({message: err})
            console.log("\x1b[41m",err)
        })
    
})

//Deletes advert
router.delete("/:id", checkAuth, (req, res) =>{
    const id = req.params.id
    Advert.findById(id)
        .then(result => {
            if (result != null){
                if (result.owner == req.decoded.email){
                    Advert.findByIdAndDelete(id)
                        .then(response => {
                            if (response != null)
                                res.status(200).json({
                                    message: "Product id " + id + " removed succesfully",
                                    info: response
                                })
                            else
                                res.status(404).json({message: "No such product"})
                        })
                        .catch( (err) =>{
                            res.status(500).json({message: err})
                            console.log("\x1b[41m",err)
                        })
                } else
                    res.status(403).json({message: "Unauthenticated"})               
            } else 
                res.status(404).json({message: "No such advert"})
        })
        .catch( (err) =>{
            res.status(500).json({message: err})
            console.log("\x1b[41m",err)
        })
    
})

module.exports = router