const express = require("express")
const mongoose = require("mongoose")
const Advert = require("../models/Advert")
const router = express.Router()

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