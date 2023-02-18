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


//sending item posts
app.get('/item-posts', async (req, res) => {
    res.status(200).json(await db.collection("posts").find({isRequest: false}, {sort: {dateCreated: -1}, limit: 20}).toArray())
})


//sending request posts
app.get('/request-posts', async (req, res) => {
    res.status(200).json(await db.collection("posts").find({isRequest: true}, {sort: {dateCreated: -1}, limit: 20}).toArray())
})



//sending user profile 
app.get('/user-profile-data/:id', async (req, res) => {
    res.status(200).json(await db.collection('users').findOne({_id: new mongo.ObjectId(req.params.id)}))
})

//sending categories
app.get('/categories', async (req, res) => {
    res.status(200).json([  {value: 'ACADEMICS', label: "Academics"},
    {value: 'HOUSEHOLD', label: "Household"},
    {value: 'ENTERTAINMENT', label: "Entertainment"},
    {value: 'OUTDOOR', label: "Outdoor"},
    {value: 'ELECTRONIC', label: "Electronic"},
    {value: 'MISC', label: "Misc"},])
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




