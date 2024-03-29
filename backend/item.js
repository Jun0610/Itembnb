const { db, mongo } = require('./mongo')
const express = require("express")
const router = express.Router()


// sending 'all' item posts from database (actually limited to 20)
router.get('/get-item-posts', async (req, res) => {
    try {
        const itemArray = await db.collection('items')
            .find()
            .limit(20)
            .sort({ dateCreated: -1 })

            // only get these attributes plus the first element of images
            .project({ _id: 1, name: 1, description: 1, images: [{ $slice: ['$images', 1] }], price: 1, review: 1 })
            .toArray();

        if (itemArray == null) {
            res.status(200).json({ success: true, data: [] })
        } else {
            // loop through all items and for each item get the reviews
            for (const item of itemArray) {

                let rating = 0;
                let num_ratings = 0;

                for (const reviewId of item.review) {
                    const review = await db.collection("reviews").findOne({ _id: new mongo.ObjectId(reviewId) })
                    if (review) {
                        num_ratings++;
                        rating += review.rating;
                    }
                }
                if (num_ratings === 0) {
                    rating = -1;
                }
                else {
                    rating /= num_ratings;
                }
                item.rating = rating;
            }

            res.status(200).json({ success: true, data: itemArray })
        }

    } catch (err) {
        res.status(404).json({ success: false, data: err });
    }

})

// sending minimalist item data (just name, description, first pic, price)
router.get('/get-item-post-min/:id', async (req, res) => {
    try {
        const id = new mongo.ObjectId(req.params.id)
        const results = await db.collection("items").findOne({ _id: id },
            // only get these fields to return
            { _id: 1, name: 1, description: 1, images: [{ $slice: ['$images', 1] }], price: 1 });

        // trim description
        if (results.description.length > 35) {
            results.description = results.description.substring(0, 32).trim() + "...";
        }

        res.status(200).json({ success: true, data: results })
    } catch (err) {
        res.status(404).json({ success: false, data: err });
    }
})

//sending a specific item post
router.get('/get-item-post/:id', async (req, res) => {
    try {
        const id = new mongo.ObjectId(req.params.id)
        const result = await db.collection("items").findOne({ _id: id });
        res.status(200).json({ success: true, data: result })
    } catch (err) {
        res.status(404).json({ success: false, data: err });
    }

})

//edit item post
router.put('/edit-item/item-id/:itemId/user-id/:userId', async (req, res) => {
    try {
        const itemId = new mongo.ObjectId(req.params.itemId);
        const checkId = await db.collection("items").findOne({ _id: itemId });
        if (checkId.ownerId != req.params.userId) {
            res.status(400).json({ success: false, data: "not owner of item!" })
        } else {
            //need to insert id into body
            req.body._id = itemId;
            const result = await db.collection("items").replaceOne({ _id: itemId }, req.body)
            res.status(201).json({ success: true, data: result });
        }
    }
    catch (err) {
        res.status(404).json({ success: false, data: err });
    }
})

//delete item post
router.delete('/delete-item/item-id/:itemId/user-id/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const itemId = req.params.itemId;
        await deleteItem(db, itemId, userId);
        res.status(200).json({ success: true, data: "item successfully deleted." })
    } catch (err) {
        res.status(200).json({ success: false, data: err });
    }

})
async function deleteItem(db, itemId, userId) {
    try {
        const res = await db.collection("items").findOne({ _id: new mongo.ObjectId(itemId) })

        // remove from requests
        const linkedToReq = res.linkedToReq;
        if (linkedToReq) {
            for (const reqId of linkedToReq) {
                await db.collection('requests').updateOne({ _id: new mongo.ObjectId(reqId) }, { $pull: { recommendedItems: itemId } })
            }
        }

        // delete linked reviews
        if (res.reviews.length > 0) {
            for (const itemId of res.reviews) {
                await db.collection('reviews').deleteOne({ _id: new mongo.ObjectId(reqId) });
            }
        }

        await db.collection('users').updateOne({ _id: new mongo.ObjectId(userId) }, { $pull: { postedItems: itemId } })
        await db.collection('items').deleteOne({ _id: new mongo.ObjectId(itemId) })
        await db.collection("users").updateMany({ favoritedItems: itemId }, { $pull: { favoritedItems: itemId } })

    } catch (err) {
        console.log(err);
        throw err;
    }
}

//sending categories
router.get('/categories', async (req, res) => {
    res.status(200).json([{ value: 'ACADEMICS', label: "Academics" },
    { value: 'HOUSEHOLD', label: "Household" },
    { value: 'ENTERTAINMENT', label: "Entertainment" },
    { value: 'OUTDOOR', label: "Outdoor" },
    { value: 'ELECTRONIC', label: "Electronic" },
    { value: 'MISC', label: "Misc" },])
})

//add item to database
router.post('/add-item/user-id/:userId', async (req, res) => {
    //save date as date object
    req.body.dateCreated = new Date(Date.now());
    try {
        const check = await db.collection("items").insertOne(req.body);
        const itemId = check.insertedId.toString();
        await db.collection('users').updateOne({ _id: new mongo.ObjectId(req.params.userId) }, { $push: { postedItems: itemId } })
        res.status(201).json({ success: true, data: "successfully added item!" })
    } catch (err) {
        res.status(404).json({ success: false, data: err })
    }
})

//allows lender to mark unavailabilities for itmes
//req.body =
/*
{
    id: the item's id
    startDate: start of unavailability
    endDate: end of unavailability
    day: day of unavailability (recurrence)
    exepction: date of unavailability
}   
*/

router.put("/mark-unavail", async (req, res) => {
    try {
        const exceptionDate = new Date(req.body.exception);
        const startDate = new Date(req.body.startDate);
        const endDate = new Date(req.body.endDate)
        await db.collection("items").updateOne({ _id: new mongo.ObjectId(req.body.id) }, { $push: { unavailList: { startDate: startDate, endDate: endDate, reservId: null, day: req.body.day, exception: exceptionDate } } })

        res.status(200).json({ success: true, data: "unavailability successfully added!" });
    } catch (err) {
        res.status(404).json({ success: false, data: err.message })
    }
})

router.get("/search/:searchString", async (req, res) => {
    try {
        console.log(req.params.searchString);

        //first get all items whose name and description match the search string
        const items = await db.collection('items').find({ $or: [{ name: { $regex: req.params.searchString, $options: 'i' } }, { description: { $regex: req.params.searchString, $options: 'i' } }] }).toArray();

        //then get items whose owner's names matches the item
        const owners = await db.collection('users').find({ name: { $regex: req.params.searchString, $options: 'i' } }, { _id: 1 }).toArray();

        for (const owner of owners) {
            const item = await db.collection('items').find({ ownerId: owner._id.toString() }).toArray();
            items.push(...item)
        }

        //ensure items are unique
        const flags = new Set();
        const uniqueItems = items.filter(item => {
            if (flags.has(item._id.toString())) {
                return false;
            }
            flags.add(item._id.toString());
            return true;
        })
        res.status(201).json({ success: true, data: uniqueItems });
    } catch (err) {
        res.status(404).json({ success: false, data: err.message })
    }
})

router.get("/get-item-by-category/:category", async (req, res) => {
    try {
        const items = await db.collection('items').find({ category: [req.params.category] },
            // only get these fields to return
            { _id: 1, name: 1, description: 1, images: [{ $slice: ['$images', 1] }], price: 1 }
        ).toArray()
        if (items === null) {
            res.status(201).json({ success: true, data: [] });
        }
        res.status(201).json({ success: true, data: items });
    } catch (err) {
        res.status(404).json({ success: false, data: err.message })
    }
})



module.exports = { router, deleteItem };
