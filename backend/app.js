const express = require('express')
const { db, mongo } = require('./mongo')   //gets mongodb db instance
const cors = require('cors')

const app = express();


//middleware
app.use(cors());

app.use(express.urlencoded({ extended: false, limit: '50mb' })) //parse form data

app.use(express.json({ limit: '50mb' })) // parse json



app.listen(8888, () => {
    console.log("server is listening on port 8888...")
})


//item related processing
const item = require("./item").router;
app.use("/api/item", item);

//request related processing
const request = require("./request").router;
app.use("/api/request", request)


//user-related processing
const user = require("./user")
app.use("/api/user", user)





