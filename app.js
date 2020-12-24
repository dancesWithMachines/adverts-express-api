const express = require("express")
const app = express();
const mongoose = require("mongoose")
require("dotenv/config")

//IMPORTS
const advertsRoute = require("./routes/adverts")

//MIDDLEWARE
app.use(express.urlencoded({ extended: true }));// Using body parser build into express
app.use(express.json());                        //

app.use("/adverts", advertsRoute)

//ROUTES

//DB CONNECTION
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true  },  () =>
    console.log("Connected to Database")
)

//LISTENING
app.listen(3000);