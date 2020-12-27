const jwt = require("jsonwebtoken");
const User = require("../models/User")

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")
        const decoded = jwt.verify(token[1], process.env.passwdJWT)
        req.decoded = decoded
        next();
    } catch (err) {
        res.status(401).json({message: "Autrhorization error"})
    }
    
}