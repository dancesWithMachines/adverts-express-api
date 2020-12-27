const express = require("express")
const app = express();
const mongoose = require("mongoose")
const morgan = require("morgan")
require("dotenv/config")

//IMPORTS
const advertsRoute = require("./routes/adverts")
const usersRoute = require("./routes/users")

//MIDDLEWARE
app.use(express.urlencoded({ extended: true }));// Using body parser build into express
app.use(express.json());
app.use(morgan("combined"))                        

app.use("/adverts", advertsRoute)
app.use("/users", usersRoute)
app.use("/uploads",express.static("uploads"))

app.use((req, res, next) => {
    const error = new Error("Did not found")
    error.status = 404;
    next(error);
})

app.use((error, req, res ,next) => {
    res.status(error.status || 500).json({
        error : {
            message: error.message
        }
    })
})

//ROUTES

//DB CONNECTION
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true  },  () =>
    console.log('\x1b[33m%s\x1b[0m',"Connected to Database")
)

//LISTENING
module.exports = app