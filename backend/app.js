const { MongoClient } = require("mongodb");
const Item = require("./item");
const ItemReview = require("./item-review");

async function main() {

    const uri = "mongodb+srv://itembnb:turkstra.db@itembnbdb.xzcvsqf.mongodb.net/?retryWrites=true&w=majority";

    const client = new MongoClient(uri);

    try {
        await client.connect();
        await listDatabases(client);
        const db = client.db("itembnb")
        const results = await db.collection("items").find().toArray();
        console.log(results)


        
        // const result = await client.db("itembnb").collection("items").insertOne(new Item({
        //     price: 5, 
        //     name: "test", 
        //     description: "test",
        //     review: [{rating: 5, reviewText: "testing123"}],
        // }));
        // console.log(result);
        
        // // const results = await client.db("itembnb").collection("items").findOne({"review.0.rating": 5})
        // // const item = new Item(results);
        // // console.log(item);
        
    }
    catch (e) {
        console.log(e);
    } finally {
        await client.close();
    }
    
}

async function listDatabases(client) {
    const databasesList = await client.db().admin().listDatabases();
    console.log("Databases: ");

    databasesList.databases.forEach((db) => {
        console.log(`-${db.name}`)
    })

}

main().catch(console.error);


