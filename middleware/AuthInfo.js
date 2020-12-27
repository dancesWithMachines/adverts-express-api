const jwt = require("jsonwebtoken");

const token = (req) => {
    try {
        const token = req.headers.authorization.split(" ")
        const decoded = jwt.verify(token[1], process.env.passwdJWT)
        return token
    } catch (err) {
        return null
    }
}

module.exports = token