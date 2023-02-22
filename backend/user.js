const {db, mongo} = require('./mongo') 
const express = require("express")
const router = express.Router()


//sending user profile 
router.get('/profile-data/:id', async (req, res) => {
    try {
        const id = new mongo.ObjectId(req.params.id)
        const results = await db.collection('users').findOne({_id: id})
        if (results == null) {
            res.status(200).json({success: true, data: null})
        } else {
            res.status(200).json({success: true, data: results})
        }
    } catch(err) {
        res.status(404).send("Could not process request.")
    }
    
})


//adding user profile
router.post('/add-user', async(req, res) => {
    try {
        const result = await db.collection("users").findOne({email: req.body.email})
        if (result == null) {
            await db.collection("users").insertOne(req.body);
            res.status(200).json({success: true, msg: "successfully added item!"})
        } else {
            res.status(400).json({success: false, msg: "bad request! email already exists"})
        }
    } catch(err) {
        res.status(404).json({success: false, msg: "could not resolve post request"})
    }
})


//favoriting an item
router.put('/:userId/favorited-item', async(req, res) => {
    try {
        const itemId = new mongo.ObjectId(req.body.itemId);
        const userId =  new mongo.ObjectId(req.params.userId);

        //only add unique items to array since we cannot favorite the same item twice
        const results = await db.collection("users").updateOne({_id: userId}, {$addToSet: {favoritedItems: itemId}})
        console.log(results);
        if (results.modifiedCount == 1) {
            res.status(200).json({success: true, data: "successfully favorited item"})
        } else if (results.modifiedCount == 0 && results.matchedCount == 1 ) {
            res.status(400).json({success: false, data: "item already favorited"})
        } else {
            res.status(400).json({success: false, data: "could not process request"})
        }
        
    } catch(err) {
        res.status(404).json({success: false, data: err})
    }
})

module.exports = router;