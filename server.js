require("dotenv").config();
const express = require("express");

const app = express();

app.use(express.json())
app.use(express.urlencoded())

app.get("/", (req, res) => {
    res.send("Express server")
})

app.post("/name", (req, res) => {
    if(req.body.name) {
        return res.json({name: req.body.name})
    } else {
        return res.status(400).json({error: "No name provided"})
    }
})

app.listen(process.env.PORT, (err) => {
    if (err) {
        return console.log(err)
    }
    console.log('Server running on port ' + process.env.PORT)
})
