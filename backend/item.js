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
    try {
        // const item = {
        //     title: req.body.name,
        //     description: req.body.description,
        //     price: req.body.price,
        //     reservHist: req.body.reservHist,
        //     unavailHist: req.body.unavailHist,
        //     review: req.body.review,
        //     category: req.body.category,
        //     //have to figure out how to add images
        // }
        console.log(req.body);
        //await db.collection("items").insertOne(item);
        res.status(200).send("Successfully inserted item!")
    } catch (err) {
        res.status(404).send(err)
    }
    
})


module.exports = router;
