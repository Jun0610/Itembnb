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

router.get("/get-review/:id", async(req, res) => {
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
        res.status(200).json({ success: true, data: reviewsWithUsers, rating: 1.0 * rating/reviewsWithUsers.length })
    } catch (err) {
        console.log(err)
        res.status(404).json({ success: false, data: err.message })
    }
})

module.exports = router;