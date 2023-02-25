const mongo = require("mongodb");
const config = require("./config")

const client = new mongo.MongoClient(config.uri);

client.connect().then( () => {
    console.log("Successfully connected to MongoDB");
}).catch((err) => {
    console.log(err);
});

const db = client.db("itembnb");

module.exports = {db, mongo};