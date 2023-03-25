// const Post = require('./post')

// class Request extends Post{
//     constructor(doc) {
//         super(doc._id, doc.name, doc.description, doc.dateCreated, doc.ownerId)
//         this.resolved_stat = doc.resolved_stat;
//         this.recommended_items = doc.recommended_items;
//     }
// }

// module.exports = Request;

const { db, mongo } = require('./mongo')
const express = require("express")
const router = express.Router()


//sending request posts
router.get('/get-request-posts', async (req, res) => {
    try {
        const results = await db.collection("requests").find().sort({ dateCreated: -1 }).limit(20).toArray();
        if (results == null) {
            res.status(200).json({ success: true, data: [] })
        } else {
            res.status(200).json({ sucess: true, data: results })
        }

    } catch (err) {
        res.status(404).json({ success: false, data: err.message })
    }

})

//sending a specific request post
router.get('/get-request-post/:id', async (req, res) => {
    try {
        const id = new mongo.ObjectId(req.params.id)
        const result = await db.collection("requests").findOne({ _id: id });
        res.status(200).json({ success: true, data: result })
    } catch (err) {
        res.status(404).json({ success: false, data: err });
    }

})

//create request post
router.post('/add-request/user-id/:userId', async (req, res) => {

    try {
        //save date as date object
        req.body.dateCreated = new Date(req.body.dateCreated);
        const results = await db.collection("requests").insertOne(req.body);
        const reqId = results.insertedId.toString();
        await db.collection('users').updateOne({ _id: new mongo.ObjectId(req.params.userId) }, { $push: { requestPosts: reqId } })
        res.status(201).json({ success: true, data: "successfully added request!" })
    } catch (err) {
        res.status(404).json({ success: false, data: err.message })
    }
})

//modify request post
router.put('/edit-request/request-id/:requestId/user-id/:userId', async (req, res) => {
    try {
        const requestId = new mongo.ObjectId(req.params.requestId);
        const request = await db.collection("requests").findOne({ _id: requestId });
        if (request.ownerID != req.params.userId) {
            res.status(400).json({ success: false, data: "not owner of item!" })
        } else {
            //need to insert id into body
            req.body._id = requestId;
            const result = await db.collection("requests").replaceOne({ _id: requestId }, req.body)
            res.status(201).json({ success: true, data: result });
        }
    } catch (err) {
        res.status(404).json({ success: false, data: err.message })
    }
})

//add recommended items
//req
/*
{   
    itemId: the item's Id as a string
}
*/
router.put('/add-recommended-item/request/:reqId', async (req, res) => {
    try {
        await db.collection("requests").updateOne({ _id: new mongo.ObjectId(req.params.reqId) }, { $push: { recommendedItems: req.body.itemId } });
        console.log(req.body.itemId);
        await db.collection('items').updateOne({ _id: new mongo.ObjectId(req.body.itemId) }, { $push: { linkedToReq: req.params.reqId } })
        res.status(200).json({ success: true, data: "successfully added item to recommended list" })
    } catch (err) {
        res.status(404).json({ success: false, data: err.message })
    }
})

//remove recommended items
//req
/*
{   
    itemId: the item's Id as a string
}
*/
router.put('/remove-recommended-item/request/:reqId', async (req, res) => {
    try {
        await db.collection("requests").updateOne({ _id: new mongo.ObjectId(req.params.reqId) }, { $pull: { recommendedItems: req.body.itemId } });
        await db.collection('items').updateOne({ _id: new mongo.ObjectId(req.body.itemId) }, { $pull: { linkedToReq: req.params.reqId } })
        res.status(200).json({ success: true, data: "successfully removed item from recommended list" })
    } catch (err) {
        res.status(404).json({ success: false, data: err.message })
    }
})

//delete request post
router.delete('/delete-request/request-id/:requestId/user-id/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const requestId = req.params.requestId;
        await deleteRequest(db, requestId, userId);
        res.status(200).json({ success: true, data: "item successfully deleted." })
    } catch (err) {
        res.status(200).json({ success: false, data: err });
    }

})
async function deleteRequest(db, requestId, userId) {
    try {
        //first update a user's requestPosts list
        await db.collection('users').updateOne({ _id: new mongo.ObjectId(userId) }, { $pull: { requestPosts: requestId } })
        //then delete the request post from the requests collection
        await db.collection('requests').deleteOne({ _id: new mongo.ObjectId(requestId) })

    } catch (err) {
        console.log(err);
        throw err;
    }
}


module.exports = { router, deleteRequest };