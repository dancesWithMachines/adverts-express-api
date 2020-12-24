const mongoose = require("mongoose")

const advertSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    owner: {type: String, required: true},
    title: {type: String, required: true, maxlength: 200},
    description: {type: String, required: true, maxlength: 1000},
    imageUrl: String
})

module.exports = mongoose.model("Advert", advertSchema)