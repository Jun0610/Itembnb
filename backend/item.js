const {db, mongo} = require('./mongo') 
const express = require("express")
const router = express.Router()


//sending item posts
router.get('/get-item-posts', async (req, res) => {
    try {
        const result = await db.collection("items").find({isRequest: false}, {sort: {dateCreated: -1}, limit: 20}).toArray();
        if (result == null) {
            res.status(200).json({success: true, data: []})
        } else {
            res.status(200).json({success: true, data: result})
        }
        
    } catch (err) {
        res.status(404).send(err)
    }
    
})

//sending categories
router.get('/categories', async (req, res) => {
    res.status(200).json([  {value: 'ACADEMICS', label: "Academics"},
    {value: 'HOUSEHOLD', label: "Household"},
    {value: 'ENTERTAINMENT', label: "Entertainment"},
    {value: 'OUTDOOR', label: "Outdoor"},
    {value: 'ELECTRONIC', label: "Electronic"},
    {value: 'MISC', label: "Misc"},])
})

//add item to database
router.post('/add-item', async (req, res) => {
    console.log("req: ", req.body);
    try {
        await db.collection("items").insertOne(req.body);
        res.status(200).json({success: true, data: "successfully added item!"})
    } catch (err) {
        res.status(404).json({success: false, data: err})
    }
    
})

router.get('/get-item-posts-1', async (req, res) => {
    try {
        const result = await db.collection("items").find({name: "Small thing"}, {sort: {dateCreated: -1}, limit: 20}).toArray();
        console
        if (result == null) {
            res.status(200).json({success: true, data: []})
        } else {
            console.log(result);
            res.status(200).json({success: true, data: result})
        }
        
    } catch (err) {
        res.status(404).send(err)
    }
    
})

module.exports = router;
