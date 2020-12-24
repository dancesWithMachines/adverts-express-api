const express = require("express")
const mongoose = require("mongoose")
const Advert = require("../models/Advert")
const router = express.Router()

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

router.get("/id", (req, res) => {
    Advert.findById(req.params.id)
        .then(result => {
            res.status(200).json(result)
        })
        .catch( err => {
            res.status(404).json({message: err})
            console.log(err)
        })
})
router.post("/", (req,res) => {
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

module.exports = router