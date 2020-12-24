const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")
        const decoded = jwt.verify(token[1], process.env.passwdJWT)
        next();
    } catch (err) {
        res.status(401).json({message: "Autrhorization error"})
    }
    
}