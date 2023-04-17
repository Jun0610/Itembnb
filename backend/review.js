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

// get all reviews for a user
router.get("/get-user-review/:id", async (req, res) => {
    try {
        const reviewSubject = await db.collection("users").findOne({ _id: new mongo.ObjectId(req.params.id) })
        const reviewsWithUsers = []
        let rating = 0;
        for (const reviewId of reviewSubject.reviewsOfUser) {
            const review = await db.collection("reviews").findOne({ _id: new mongo.ObjectId(reviewId) })
            if (review) {
                const user = await db.collection("users").findOne({ _id: new mongo.ObjectId(review.reviewerId) })
                if (user) {
                    reviewsWithUsers.push({ review, user })
                    rating += review.rating;
                }
            }
        }
        if (reviewsWithUsers.length == 0) {
            rating = -1;
        }
        else {
            rating /= reviewsWithUsers.length;
        }
        res.status(200).json({ success: true, data: reviewsWithUsers, rating: rating })
    } catch (err) {
        console.log(err)
        res.status(404).json({ success: false, data: err.message })
    }
})

// get all reviews made by a user
router.get("/get-reviews-made-by-user/:id", async (req, res) => {
    try {
        const reviewer = await db.collection("users").findOne({ _id: new mongo.ObjectId(req.params.id) })
        const reviewsWithUsers = []
        for (const reviewId of reviewer.reviewsMade) {
            const review = await db.collection("reviews").findOne({ _id: new mongo.ObjectId(reviewId) })
            if (review) {
                const user = await db.collection("users").findOne({ _id: new mongo.ObjectId(review.reviewerId) })
                if (user) reviewsWithUsers.push({ review, user })
            }
        }
        res.status(200).json({ success: true, data: reviewsWithUsers })
    } catch (err) {
        console.log(err)
        res.status(404).json({ success: false, data: err.message })
    }
})

// get all reviews for an item
router.get("/get-item-review/:id", async (req, res) => {
    try {
        const item = await db.collection("items").findOne({ _id: new mongo.ObjectId(req.params.id) })
        const reviewsWithUsers = [];
        let rating = 0;
        if (item.review) {
            for (const reviewId of item.review) {
                const review = await db.collection("reviews").findOne({ _id: new mongo.ObjectId(reviewId) })
                if (review) {
                    const user = await db.collection("users").findOne({ _id: new mongo.ObjectId(review.reviewerId) })
                    if (user) {
                        rating += review.rating;
                        reviewsWithUsers.push({ review, user });
                    }
                }
            }
        }
        if (reviewsWithUsers.length == 0) {
            rating = -1;
        }
        else {
            rating /= reviewsWithUsers.length;
        }
        res.status(200).json({ success: true, data: reviewsWithUsers, rating: rating });
    } catch (err) {
        console.log(err)
        res.status(404).json({ success: false, data: err.message })
    }
})

// update review
router.put("/update-review/:id", async (req, res) => {
    try {
        // find the review
        const review = await db.collection("reviews").findOne({ _id: new mongo.ObjectId(req.params.id) })
        if (!review) res.status(404).json({ success: false, data: "no review found" })
        console.log("body: ", req.body);
        const result = await db.collection("reviews").updateOne({ _id: new mongo.ObjectId(req.params.id) }, { $set: { "rating": parseInt(req.body.rating), "dateModified": new Date(Date.now()), "text": req.body.text } })
        res.status(201).json({ success: true, data: result });
    } catch (err) {
        console.log(err)
        res.status(404).json({ success: false, data: err.message })
    }
})

//create new review
router.post('/add-review/user-id/:userId', async (req, res) => {
    try {
        //save date as date object
        req.body.dateModified = new Date(req.body.dateModified);
        const results = await db.collection("reviews").insertOne(req.body);

        const reviewId = results.insertedId.toString();

        console.log(results);
        console.log(reviewId);

        // every user tracks reviews they've left
        await db.collection('users').updateOne({ _id: new mongo.ObjectId(req.params.reviewerId) }, { $push: { reviewsMade: reviewId } })

        // if review is review of an item
        if (req.body.userId == "" && req.body.itemId != "") {
            const results2 = await db.collection('items').updateOne({ _id: new mongo.ObjectId(req.body.itemId) }, { $push: { review: reviewId } });
            console.log(results2);
        }
        // if review is review of a user
        else if (req.body.itemId == "" && req.body.userId != "") {
            const results2 = await db.collection('users').updateOne({ _id: new mongo.ObjectId(req.body.userId) }, { $push: { reviewsOfUser: reviewId } });
            console.log(results2);
        }
        else {
            // we should never reach this point
            console.error(req);
            throw new Error('Improperly formatted review!');
        }

        res.status(201).json({ success: true, data: "successfully added review!" });

    } catch (err) {
        res.status(404).json({ success: false, data: err.message })
    }
})

// delete review
router.delete('/delete-review/review-id/:reviewId', async (req, res) => {
    try {
        const reviewId = req.params.reviewId;

        await deleteReview(db, reviewId);

        res.status(200).json({ success: true, data: "Review successfully deleted." })
    } catch (err) {
        res.status(200).json({ success: false, data: err });
    }
})

async function deleteReview(db, reviewId) {
    const review = await db.collection("reviews").findOne({ _id: new mongo.ObjectId(reviewId) });

    try {
        // first update reviewer's reviewsMade list
        await db.collection('users').updateOne({ _id: new mongo.ObjectId(review.reviewerId) }, { $pull: { reviewsMade: reviewId } })

        // then delete the review from the user/item it's for
        // if review is review of an item
        if (review.userId == "" && review.itemId != "") {
            const results2 = await db.collection('items').updateOne({ _id: new mongo.ObjectId(review.itemId) }, { $pull: { review: reviewId } });
            console.log(results2);
        }
        // if review is review of a user
        else if (review.itemId == "" && review.userId != "") {
            const results2 = await db.collection('users').updateOne({ _id: new mongo.ObjectId(review.userId) }, { $pull: { reviewsOfUser: reviewId } });
            console.log(results2);
        }
        else {
            // we should never reach this point
            console.error(review);
            throw new Error('Improperly formatted review!');
        }

        // then delete the review post from the reviews collection
        await db.collection('reviews').deleteOne({ _id: new mongo.ObjectId(reviewId) })

    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = router;