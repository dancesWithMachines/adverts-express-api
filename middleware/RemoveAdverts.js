const Advert = require("../models/Advert")

module.exports = async (req, res, next) => {
    try {
        var usrAdverts = await Advert.find(({owner: req.decoded.email}))
        var ids = []
        for (var id in usrAdverts){
            ids.push(usrAdverts[id]._id)
        }
        console.log(ids)
        for (var id in ids){
            await Advert.findByIdAndDelete(ids[id])
        }
        next();
    } catch (err) {
        res.status(500).json({message: "Error occured when removing adverts"})
        console.log("\x1b[31m",err)
    }
}