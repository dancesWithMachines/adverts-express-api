const express = require("express")
const router = express.Router();
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const checkAuth = require("../middleware/AuthChecker")

const User = require("../models/User")

router.post("/register", (req, res) => {
    bcrypt.hash(req.body.password, 10,(err, hash) =>{
        if (err) {
            return res.status(500).json({error: err})
        } else {
            const user = new User({
                _id: new mongoose.Types.ObjectId,
                email: req.body.email,
                password: hash
            })

            user.save()
                .then(result => {
                    res.status(201).json({message: "User added"})
                })
                .catch( err => {
                    res.status(500).json({error: err})
                    console.log(err)
                })
        }
    })
})

router.delete("/:id", checkAuth, (req, res) => {
    const id = req.params.id
    console.log('\x1b[33m%s\x1b[0m',"USR_ID: " + id)
    User.findByIdAndRemove(req.params.id)
        .then(result => {     
            if (result != null)      
                res.status(200).json({message: "User deleted", info: result})
            else
                res.status(404).json({message: "User not found"})
        })
        .catch( (err) => {
            res.status(500).json({error: err})
            console.log(err)
        })
})

router.post("/login", (req, res) => {
    User.findOne({ email: req.body.email})
        .then(user => {
            if (!user) {
                res.status(401).json({message: "User not found"})
            }
            bcrypt
                .compare(req.body.password, user.password)
                .then((result) => {
                    if (result) {
                        const token = jwt.sign({
                            email: user.email,
                            userId: user._id
                        }, process.env.passwdJWT, {
                            expiresIn: "1h"
                        });
                        res.status(200).json({
                            message: "User logged",
                            userId: user._id,
                            token: token
                        })
                    } else {
                        res.status(401).json({message: "Authorization error"})
                    }
                })
                .catch( (err) => {
                    res.status(500).json({error: err})
                    console.log(err)
                })

            //res.status(200).json(user)
        })
        .catch( (err) => {
            res.status(500).json({error: err})
            console.log(err)
        })
})
module.exports = router