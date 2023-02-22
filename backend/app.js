const express = require('express')
const {db, mongo} = require('./mongo')   //gets mongodb db instance
const cors = require('cors')


const app = express();


//middleware
app.use(cors())

//parse form data
app.use(express.urlencoded({ extended: false }))

// parse json
app.use(express.json())




app.listen(8888, () => {
    console.log("server is listening on port 8888...")
})


//item related processing
const item = require("./item");
app.use("/api/item", item);

//request related processing
const request = require("./request")
app.use("/api/request", request)


//user-related processing
const user = require("./user")
app.use("/api/user", user)





