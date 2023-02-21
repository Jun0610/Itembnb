const {db, mongo} = require('./mongo') 
const express = require("express")
const router = express.Router()


//sending user profile 
router.get('/profile-data/:id', async (req, res) => {
    try {
        const id = await new mongo.ObjectId(req.params.id)
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

module.exports = router;