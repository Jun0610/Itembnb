const db = require("./mongo")
const express = require("express")
const router = express.Router()


//sending item posts
router.get('/get-item-posts', async (req, res) => {
    res.status(200).json(await db.collection("posts").find({isRequest: false}, {sort: {dateCreated: -1}, limit: 20}).toArray())
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


module.exports = router;
