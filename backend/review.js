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

const getUserMin = require('./utility').getUserMin;

//sending a single specific review
router.get('/get-review/:id', async (req, res) => {
    try {
        const id = new mongo.ObjectId(req.params.id)
        const result = await db.collection("reviews").findOne({ _id: id });
        res.status(200).json({ success: true, data: result })
    } catch (err) {
        res.status(404).json({ success: false, data: err });
    }
})

// get only average rating for a user (borrower)
router.get("/get-user-rating/:id", async (req, res) => {
    try {
        const reviewSubject = await db.collection("users").findOne({ _id: new mongo.ObjectId(req.params.id) })
        let rating = 0;
        let num_ratings = 0;
        for (const reviewId of reviewSubject.reviewsOfUser) {
            const review = await db.collection("reviews").findOne({ _id: new mongo.ObjectId(reviewId) })
            if (review) {
                if (user) {
                    num_ratings++;
                    rating += review.rating;
                }
            }
        }
        if (num_ratings == 0) {
            rating = -1;
        }
        else {
            rating /= num_ratings;
        }
        res.status(200).json({ success: true, rating: rating })
    } catch (err) {
        console.log(err)
        res.status(404).json({ success: false, data: err.message })
    }
})

// get all reviews and avg. rating for a user (borrower)
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
                if (user) reviewsWithUsers.push({ review })
            }
        }
        res.status(200).json({ success: true, data: reviewsWithUsers })
    } catch (err) {
        console.log(err)
        res.status(404).json({ success: false, data: err.message })
    }
})

// get only average rating for an item
router.get("/get-item-rating/:id", async (req, res) => {
    try {
        const item = await db.collection("items").findOne({ _id: new mongo.ObjectId(req.params.id) })
        let rating = 0;
        let num_ratings = 0;
        for (const reviewId of item.review) {
            const review = await db.collection("reviews").findOne({ _id: new mongo.ObjectId(reviewId) })
            if (review) {
                num_ratings++;
                rating += review.rating;
            }
        }
        if (num_ratings == 0) {
            rating = -1;
        }
        else {
            rating /= num_ratings;
        }
        res.status(200).json({ success: true, rating: rating })
    } catch (err) {
        console.log(err)
        res.status(404).json({ success: false, data: err.message })
    }
})

// get all reviews and avg. rating for an item
router.get("/get-item-review/:id", async (req, res) => {
    try {
        const item = await db.collection("items").findOne({ _id: new mongo.ObjectId(req.params.id) })
        const reviewsWithUsers = [];
        let rating = 0;
        if (item.review) {
            for (const reviewId of item.review) {
                const review = await db.collection("reviews").findOne({ _id: new mongo.ObjectId(reviewId) })
                if (review) {
                    const user = await getUserMin(db, review.reviewerId);
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
router.post('/add-review/reservation-id/:reservationId', async (req, res) => {
    try {
        // check reservation associated with review 
        // (to ensure you're not reviewing the same reservation twice)

        // if review of item (from borrower)
        if (req.body.userId == "" && req.body.itemId != "") {
            const reservation = await db.collection("reservations").findOne({ _id: new mongo.ObjectId(req.params.reservationId) }, { borrowerReview: 1 });
            console.log(reservation + " " + (reservation.borrowerReview === ""));

            if (reservation.borrowerReview !== "") {
                console.error("Review already exists! Review id: " + reservation.borrowerReview);
                throw new Error("Review already exists! Review id: " + reservation.borrowerReview);
            }
        }
        // if review of borrower (from lender)
        else if (req.body.userId != "" && req.body.itemId == "") {
            const reservation = await db.collection("reservations").findOne({ _id: new mongo.ObjectId(req.params.reservationId) }, { lenderReview: 1 });
            console.log(reservation + " " + (reservation.lenderReview === ""));

            if (reservation.lenderReview !== "") {
                console.error("Review already exists! Review id: " + reservation.lenderReview);
                throw new Error("Review already exists! Review id: " + reservation.lenderReview);
            }
        }
        else {
            console.error("Improperly formatted review! " + req.body);
            throw new Error("Improperly formatted review!");
        }

        // actually create reservation, set appropriate fields

        //save date as date object
        req.body.dateModified = new Date(req.body.dateModified);
        const results = await db.collection("reviews").insertOne(req.body);
        const reviewId = results.insertedId.toString();

        // every user tracks reviews they've left
        await db.collection('users').updateOne({ _id: new mongo.ObjectId(req.body.reviewerId) }, { $push: { reviewsMade: reviewId } });

        // if review is review of an item (from borrower)
        if (req.body.userId == "" && req.body.itemId != "") {
            await db.collection('items').updateOne({ _id: new mongo.ObjectId(req.body.itemId) }, { $push: { review: reviewId } });

            await db.collection('reservations').updateOne({ _id: new mongo.ObjectId(req.params.reservationId) }, { $set: { borrowerReview: reviewId } });
        }
        // if review is review of a user (from lender)
        else if (req.body.itemId == "" && req.body.userId != "") {
            await db.collection('users').updateOne({ _id: new mongo.ObjectId(req.body.userId) }, { $push: { reviewsOfUser: reviewId } });

            await db.collection('reservations').updateOne({ _id: new mongo.ObjectId(req.params.reservationId) }, { $set: { lenderReview: reviewId } });
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

        // delete the review from the user/item it's for
        // if review is review of an item (from borrower)
        if (review.userId == "" && review.itemId != "") {
            await db.collection('items').updateOne({ _id: new mongo.ObjectId(review.itemId) }, { $pull: { review: reviewId } });

            await db.collection('reservations').updateOne({ _id: new mongo.ObjectId(review.reservationId) }, { $set: { borrowerReview: "" } });
        }
        // if review is review of a user (from lender)
        else if (review.itemId == "" && review.userId != "") {
            await db.collection('users').updateOne({ _id: new mongo.ObjectId(review.userId) }, { $pull: { reviewsOfUser: reviewId } });

            await db.collection('reservations').updateOne({ _id: new mongo.ObjectId(review.reservationId) }, { $set: { lenderReview: "" } });
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