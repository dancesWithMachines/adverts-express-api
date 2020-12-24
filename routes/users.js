const express = require("express")
const router = express.Router();
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");

const User = require("../models/User")

router.post("/signup", (req, res) => {
    bcrypt.hash(req.body.password, 10,(err, hash) =>{
        if (err) {
            return res.status(500).json({error: err})
        } else {
            const user = new User({
                _id: new mongoose.Types.ObjectId,
                login: req.body.login,
                password: hash
            })

            user.save()
                .then(result => {
                    res.status(201).json({message: "User added"})
                })
                .catch( err => res.status(500).json({error: err}))
        }
    })
})

router.delete("/userId", (req, res) => {
    User.findByIdAndRemove(req.params.userId)
        .then(result => {
            res.status(201).json({message: "User deleted", info: result})
        })
        .catch( (err) => res.status(500).json({error: err}))
})

router.post("/login", (req, res) => {
    User.findOne({ login: req.body.login})
        .then(user => {
            if (!user) {
                res.status(401).json({message: "Authorization error"})
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
                            token: token
                        })
                    } else {
                        res.status(401).json({message: "Authorization error"})
                    }
                })
                .catch((err) => res.status(500).json({error: err}))

            //res.status(200).json(user)
        })
        .catch( (err) => res.status(500).json({error: err}))
})
module.exports = router