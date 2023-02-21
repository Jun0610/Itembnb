// const Post = require('./post')

// class Request extends Post{
//     constructor(doc) {
//         super(doc._id, doc.name, doc.description, doc.dateCreated, doc.ownerId)
//         this.resolved_stat = doc.resolved_stat;
//         this.recommended_items = doc.recommended_items;
//     }
// }

// module.exports = Request;

const {db, mongo} = require('./mongo') 
const express = require("express")
const router = express.Router()


//sending request posts
router.get('/get-request-posts', async (req, res) => {
    try {
        const results = await db.collection("items").find({isRequest: true}, {sort: {dateCreated: -1}, limit: 20}).toArray()
        if (results == null) {
            res.status(200).json({success: true, data: []})
        } else {
            res.status(200).json({sucess: true, data: results})
        }
        
    } catch (err) {
        res.status(404).send("Could not process request.")
    }
    
})

module.exports = router;