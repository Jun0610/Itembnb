// const Post = require('./post')

// class Request extends Post{
//     constructor(doc) {
//         super(doc._id, doc.name, doc.description, doc.dateCreated, doc.ownerId)
//         this.resolved_stat = doc.resolved_stat;
//         this.recommended_items = doc.recommended_items;
//     }
// }

// module.exports = Request;

const db = require("./mongo")
const express = require("express")
const router = express.Router()


//sending request posts
router.get('/get-request-posts', async (req, res) => {
    res.status(200).json(await db.collection("posts").find({isRequest: true}, {sort: {dateCreated: -1}, limit: 20}).toArray())
})

module.exports = router;