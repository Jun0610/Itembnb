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
        const results = await db.collection("requests").find().sort({dateCreated: -1}).limit(20).toArray();
        if (results == null) {
            res.status(200).json({success: true, data: []})
        } else {
            res.status(200).json({sucess: true, data: results})
        }
        
    } catch (err) {
        res.status(404).json({success: false, data: err})
    }
    
})

//sending a specific request post
router.get('/get-request-post/:id', async(req, res) => {
    try {
        const id = new mongo.ObjectId(req.params.id)
        const result = await db.collection("requests").findOne({_id: id});
        res.status(200).json({success: true, data: result})
    } catch (err) {
        res.status(404).json({success: false, data: err});
    }
        
})



//create request post
router.post('/add-request', async(req, res) => {

    
    try {
        //save date as date object
        req.body.dateCreated = new Date(Date.now());
        const results = await db.collection("requests").insertOne(req.body);
        res.status(201).json({success: true, data: "successfully added request!"})
    } catch (err) {
        res.status(404).json({success: false, data: err})
    }
})

//modify request post
router.put('/edit-request/request-id/:requestId/user-id/:userId', async (req, res) => {
    try {
        const requestId = new mongo.ObjectId(req.params.requestId);
        const request = await db.collection("requests").findOne({_id: requestId});
        if (request.ownerId != req.params.userId) {
            res.status(400).json({success: false, data: "not owner of item!"})
        } else {
            //need to insert id into body
            req.body._id = requestId;
            const result = await db.collection("requests").replaceOne({_id: requestId}, req.body)
            res.status(201).json({success: true, data: result});
        }
    } catch (err) {
        res.status(404).json({success: false, data: err})
    }
})

//delete request post
router.delete('/delete-request/request-id/:requestId/user-id/:userId', async(req, res) => {
    try {
        const userId = req.params.userId;
        const requestId = req.params.requestId;
        await deleteRequest(db, requestId, userId);
        res.status(200).json({success: true, data: "item successfully deleted."})
    } catch (err) {
        res.status(200).json({success: false, data: err});
    }

})
async function deleteRequest(db, requestId, userId) {
    try {
        await db.collection('users').updateOne({_id: new mongo.ObjectId(userId)}, {$pull: {postedItems: requestId}})
        await db.collection('requests').deleteOne({_id: new mongo.ObjectId(requestId)})
        await db.collection("users").updateMany({favoritedItems: requestId},{$pull: {favoritedItems: requestId}})
        
    } catch (err) {
        console.log(err);
        throw err;
    }
}


module.exports = {router, deleteRequest};