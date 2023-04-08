/*class Review {
    constructor(doc) {
        // this.id = doc.id
        this.rating = doc.rating;
        this.reviewText = doc.reviewText;
        this.dateMod = doc.dateMod;
        this.reviwerId = doc.reviewerId;
        this.itemId = doc.itemId;
    }
}
module.exports = Review*/

const { db, mongo } = require('./mongo')
const express = require("express")
const router = express.Router()

router.get("/get-review/:id", async (req, res) => {
    try {
        //get reviews for an item
        const item = await db.collection("items").findOne({ _id: new mongo.ObjectId(req.params.id) })
        const reviewsWithUsers = []
        var rating = 0.0;
        if (item.review) {
            for (const reviewId of item.review) {
                const review = await db.collection("reviews").findOne({ _id: new mongo.ObjectId(reviewId) })
                rating += review.rating;
                if (review) {
                    const user = await db.collection("users").findOne({ _id: new mongo.ObjectId(review.reviewerId) })
                    if (user) reviewsWithUsers.push({ review, user })
                }
            }
        }
        res.status(200).json({ success: true, data: reviewsWithUsers, rating: 1.0 * rating / reviewsWithUsers.length })
    } catch (err) {
        console.log(err)
        res.status(404).json({ success: false, data: err.message })
    }
})

router.put("/update-review/:id", async (req, res) => {
    try {
        //find the review
        const review = await db.collection("reviews").findOne({ _id: new mongo.ObjectId(req.params.id) })
        if (!review) res.status(404).json({ success: false, data: "no review found" })
        console.log("body: ", req.body);
        const result = await db.collection("reviews").updateOne({ _id: new mongo.ObjectId(req.params.id) }, { $set: { "rating": parseInt(req.body.rating), "dateModified": new Date(Date.now()), "reviewTxt": req.body.reviewTxt } })
        res.status(201).json({ success: true, data: result });
    } catch (err) {
        console.log(err)
        res.status(404).json({ success: false, data: err.message })
    }
})

router.delete('/delete-review/review-id/:reviewId/item-id/:itemId', async (req, res) => {
    try {
        const reviewId = req.params.reviewId;
        const itemId = req.params.itemId;

        // remove the review from reviews
        await db.collection('reviews').deleteOne({ _id: new mongo.ObjectId(reviewId) })

        // remove the review from the review array
        await db.collection('items').updateOne({ _id: new mongo.ObjectId(itemId) }, { $pull: { review: reviewId } })

        res.status(200).json({ success: true, data: "item successfully deleted." })
    } catch (err) {
        res.status(200).json({ success: false, data: err });
    }

})

//create new item review
router.post('/add-review/user-id/:userId', async (req, res) => {

    try {
        //save date as date object
        req.body.dateModified = new Date(req.body.dateModified);
        const results = await db.collection("reviews").insertOne(req.body);

        const reviewId = results.insertedId.toString();
        const itemId = req.body.itemId;

        console.log(results);
        console.log(reviewId);
        console.log(itemId);

        // await db.collection('users').updateOne({ _id: new mongo.ObjectId(req.params.userId) }, { $push: { itemReviews: reviewId } })
        const results2 = await db.collection('items').updateOne({ _id: new mongo.ObjectId(itemId) }, { $push: { review: reviewId } });
        console.log(results2);
        res.status(201).json({ success: true, data: "successfully added review!" });

    } catch (err) {
        res.status(404).json({ success: false, data: err.message })
    }
})

module.exports = router;