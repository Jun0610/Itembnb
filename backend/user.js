const { db, mongo } = require('./mongo')
const express = require("express")
const router = express.Router()
const deleteItem = require('./item').deleteItem;
const deleteRequest = require('./request').deleteRequest;
const deleteReview = require('./review').deleteReview;
const getUserMin = require('./utility').getUserMin;
const bcrypt = require('bcrypt');

//registering user
router.post('/register-user', async (req, res) => {
    try {
        //check email
        const user = await db.collection("users").findOne({ email: req.body.email })
        if (user != null) {
            res.status(400).json({ success: false, data: "email already taken" })
        } else {
            req.body._id = new mongo.ObjectId();    //initialize id of user

            //hash password
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            req.body.password = hashedPassword;

            //add user to database
            await db.collection('users').insertOne(req.body);

            //send user info back
            res.status(201).json({ success: true, data: req.body })
        }

    } catch (err) {
        console.log(err);
        res.status(404).json({ sucess: false, data: err });
    }
})


//user login
router.post('/user-login', async (req, res) => {
    try {
        const user = await db.collection('users').findOne({ email: req.body.email });
        if (user == null) {
            return res.status(403).json({ success: false, email: false, data: "email not found" })
        }

        if (await bcrypt.compare(req.body.password, user.password)) {
            res.status(200).json({ success: true, email: true, password: true, data: user })
        } else {
            res.status(403).json({ success: false, email: true, password: false, data: "incorrect password" })
        }
    } catch (err) {
        res.status(404).json({ success: false, data: err });
    }
})

// sending minimalist user data (just name, profile pic, description)
router.get('/user-data-min/:id', async (req, res) => {
    try {
        const results = await getUserMin(db, req.params.id);
        res.status(200).json({ success: true, data: results })
    } catch (err) {
        res.status(200).json({ success: false, data: err });
    }
})

//sending user profile 
router.get('/profile-data/:id', async (req, res) => {
    try {
        const id = new mongo.ObjectId(req.params.id)
        const results = await db.collection('users').findOne({ _id: id })
        if (results == null) {
            res.status(200).json({ success: true, data: null })
        } else {
            res.status(200).json({ success: true, data: results })
        }
    } catch (err) {
        res.status(404).json({ sucess: false, data: err });
    }

})

//modify user data
router.put('/edit-profile/:userId', async (req, res) => {
    try {
        const id = new mongo.ObjectId(req.params.userId);
        //need to insert id into body
        req.body._id = id;
        const result = await db.collection("users").replaceOne({ _id: id }, req.body)
        res.status(201).json({ success: true, data: result });
    }
    catch (err) {
        res.status(404).json({ success: false, data: err });
    }
})



//delete user data
router.delete('/delete-user/:userId', async (req, res) => {
    try {
        //first delete all user's items and requests
        const user = await db.collection("users").findOne({ _id: new mongo.ObjectId(req.params.userId) })
        const listOfItems = user.postedItems;
        listOfItems.forEach(async (itemId) => {
            await deleteItem(db, itemId, req.params.userId);
        })
        const listofRequests = user.requestPosts;
        listofRequests.forEach(async (requestId) => {
            await deleteRequest(db, requestId, req.params.userId);
        })

        // delete all reviews made by the user
        const listOfReviews = user.reviewsMade;
        listOfReviews.forEach(async (reviewId) => {
            await deleteReview(db, reviewId);
        })
        // delete all reviews of this user
        const listOfReviews2 = user.reviewsOfUser;
        listOfReviews2.forEach(async (reviewId) => {
            await deleteReview(db, reviewId);
        })

        //then delete user
        await db.collection('users').deleteOne({ _id: new mongo.ObjectId(req.params.userId) })

        res.status(200).json({ success: true, data: "item successfully deleted." })
    } catch (err) {
        res.status(200).json({ success: false, data: err });
    }

})


//adding user profile
router.post('/add-user', async (req, res) => {
    try {
        const result = await db.collection("users").findOne({ email: req.body.email })
        if (result == null) {
            await db.collection("users").insertOne(req.body);
            res.status(200).json({ success: true, msg: "successfully added item!" })
        } else {
            res.status(400).json({ success: false, msg: "bad request! email already exists" })
        }
    } catch (err) {
        res.status(404).json({ success: false, msg: "could not resolve post request" })
    }
})


//favoriting an item
router.put('/:userId/favorite-item', async (req, res) => {
    try {
        const userId = new mongo.ObjectId(req.params.userId);

        //only add unique items to array since we cannot favorite the same item twice
        const results = await db.collection("users").updateOne({ _id: userId }, { $addToSet: { favoritedItems: req.body.itemId } })
        console.log(results);
        if (results.modifiedCount == 1) {
            res.status(201).json({ success: true, data: "successfully favorited item" })
        } else if (results.modifiedCount == 0 && results.matchedCount == 1) {
            res.status(400).json({ success: false, data: "item already favorited" })
        } else {
            res.status(400).json({ success: false, data: "could not process request" })
        }

    } catch (err) {
        res.status(404).json({ success: false, data: err })
    }
})

//unfavoriting an item
router.put('/:userId/unfavorite-item', async (req, res) => {
    try {
        const userId = new mongo.ObjectId(req.params.userId);

        //remove item id from array
        const results = await db.collection("users").updateOne({ _id: userId }, { $pull: { favoritedItems: req.body.itemId } })
        console.log(results);
        if (results.modifiedCount == 1) {
            res.status(201).json({ success: true, data: "successfully unfavorited item" })
        } else {
            res.status(400).json({ success: false, data: "could not process request" })
        }

    } catch (err) {
        res.status(404).json({ success: false, data: err })
    }
})

router.put('/turn-on-notifications/:userId', async (req, res) => {
    try {
        await db.collection("users").updateOne({ _id: new mongo.ObjectId(req.params.userId) }, { $set: { isNotification: true } })
        res.status(201).json({ success: true, data: "notifications-on" })
    } catch (err) {
        res.status(404).json({ success: false, data: err.messsage })
    }
})

router.put('/turn-off-notifications/:userId', async (req, res) => {
    try {
        await db.collection("users").updateOne({ _id: new mongo.ObjectId(req.params.userId) }, { $set: { isNotification: false } })
        res.status(201).json({ success: true, data: "notifications-off" })
    } catch (err) {
        res.status(404).json({ success: false, data: err.messsage })
    }
})

router.get('/get-notification-status/:userId', async (req, res) => {
    try {
        const user = await db.collection("users").findOne({ _id: new mongo.ObjectId(req.params.userId) })
        if (user.isNotification) {
            res.status(201).json({ success: true, data: "notifications-on" })
        } else {
            res.status(201).json({ success: true, data: "notifications-off" })
        }
    } catch (err) {
        res.status(404).json({ success: false, data: err.messsage })
    }
})


/*req.body = {
 message: message
}*/
router.put('/add-notification/:userId', async (req, res) => {
    console.log("req: ", req)
    try {
        await db.collection("users").updateOne({ _id: new mongo.ObjectId(req.params.userId) }, { $addToSet: { notificationList: req.body.message } })
        res.status(200).json({ success: true, data: "successfully added notification" })
    } catch (err) {
        res.status(404).json({ success: false, data: err.messsage })
    }
})

router.get('/get-users/:userName', async (req, res) => {
    try {
        const users = await db.collection('users').find({ name: { $regex: req.params.userName, $options: 'i' } }).toArray();
        res.status(200).json({ success: true, data: users });
    } catch (err) {
        res.status(404).json({ success: false, data: err.messsage })
    }
})

module.exports = router;