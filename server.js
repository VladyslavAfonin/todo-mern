require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser")

const authRoute = require("./routes/auth")
const todosRoute = require("./routes/todos")

const app = express();

app.use(express.json())
app.use(express.urlencoded())
app.use(cookieParser())

app.use("/api/auth", authRoute);
app.use("/api/todos", todosRoute);

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("Connected to database!");
    app.listen(process.env.PORT, () => {
        console.log('Server running on port ' + process.env.PORT)
    })
}).catch(err => {
    console.log(err)
})
