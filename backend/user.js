const db = require("./mongo")
const express = require("express")
const router = express.Router()


//sending user profile 
router.get('/profile-data/:id', async (req, res) => {
    res.status(200).json(await db.collection('users').findOne({_id: new mongo.ObjectId(req.params.id)}))
})

module.exports = router;