const express = require('express')
const db = require('./mongo')   //gets mongodb db instance
const cors = require('cors')

const cors = require('cors');

const app = express();


//middleware
app.use(cors())




app.listen(8888, () => {
    console.log("server is listening on port 8888...")
})


//item related processing
const item = require("./item");
app.use("/item", item);

//request related processing
const request = require("./request")
app.use("/request", request)


//user-related processing
const user = require("./user")
app.use("/user", user)





