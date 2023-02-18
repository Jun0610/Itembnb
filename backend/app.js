const mongo = require("mongodb");
const config = require("./config")
const express = require('express')
const {Item, Category} = require("./item");
const Review = require("./review");

const app = express();


app.listen(8888, () => {
    console.log("server is listening on port 8888...")
})


const client = new mongo.MongoClient(config.uri);

client.connect().then( () => {
    console.log("Successfully connected to MongoDB");
});

const db = client.db("itembnb");


//sending posts
app.get('/item-posts', async (req, res) => {
    res.status(200).json(await db.collection("posts").find({isRequest: false}, {sort: {dateCreated: -1}, limit: 20}).toArray())
})

app.get('/request-posts', async (req, res) => {
    res.status(200).json(await db.collection("posts").find({isRequest: true}, {sort: {dateCreated: -1}, limit: 20}).toArray())
})


//creating item post
// app.post



console.log("test");

async function listDatabases(client) {
    const databasesList = await client.db().admin().listDatabases();
    console.log("Databases: ");

    databasesList.databases.forEach((db) => {
        console.log(`-${db.name}`)
    })

}




