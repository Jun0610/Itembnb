const { db, mongo } = require('./mongo')
const express = require("express")
const router = express.Router()

//STATUSES:
/*
pending
denied
approved (reservation has been approved but the borrowe has not received it)
active (when the item is with the borrower)
complete (when the item has been returned to the lender)
*/

//makes user reservation
//req expected:
/*
{
    borrowerId: the user's id
    itemId: the item's id
    startDate: the reservation's start date
    endDate: the reservation's end date
}
*/
router.post("/make-reservation", async (req, res) => {
    try {
        //add reservation to reservations collection

        //need to store dates in mongoDB
        req.body.startDate = new Date(req.body.startDate);
        req.body.endDate = new Date(req.body.endDate);

        // string to store id of reviews associated with reservation (currently none) 
        // reviews can only be made once reservation is complete
        req.body.borrowerReview = "";
        req.body.lenderReview = "";

        //a reservation status is always pending initially
        req.body.status = 'pending';
        const results = await db.collection("reservations").insertOne(req.body);
        const reservId = results.insertedId.toString();

        //add reservation id to item's reservHist and reservation dates to item's pendingList
        await db.collection("items").updateOne({ _id: new mongo.ObjectId(req.body.itemId) }, { $push: { reservHist: reservId, pendingList: { startDate: req.body.startDate, endDate: req.body.endDate, reservId: reservId } } });

        //add reservation id to user's reservHist
        await db.collection("users").updateOne({ _id: new mongo.ObjectId(req.body.borrowerId) }, { $push: { reservHist: reservId } });

        //send back the data if successful
        res.status(201).json({ success: true, data: "successfully added reservation" });

    } catch (err) {
        res.status(404).json({ success: false, data: err.message })
    }

})

//approve reservation
//req expected:
/*
{
    id: the reservation id
    itemId: the item's id
    startDate: the reservation's start date
    endDate: the reservation's end date
}
*/
router.put("/approve-reservation", async (req, res) => {
    try {

        req.body.startDate = new Date(req.body.startDate);
        req.body.endDate = new Date(req.body.endDate);


        //update reservation status to approved
        db.collection("reservations").updateOne({ _id: new mongo.ObjectId(req.body.id) }, { $set: { status: "approved" } })

        //remove reservation from item's pendingList
        await db.collection("items").updateOne({ _id: new mongo.ObjectId(req.body.itemId) }, { $pull: { pendingList: { reservId: req.body.id } } })

        //then add reservation to item's unavailList
        await db.collection("items").updateOne({ _id: new mongo.ObjectId(req.body.itemId) }, { $push: { unavailList: { startDate: req.body.startDate, endDate: req.body.endDate, reservId: req.body.id } } })

        res.status(201).json({ success: true, data: "successfully approved reservation" });
    } catch (err) {
        res.status(404).json({ success: false, data: err.message })
    }
})

//deny reservation
//req expected:
/*
{
    id: the reservation id
    itemId: the item's id
    startDate: the reservation's start date
    endDate: the reservation's end date
}
*/
router.put("/deny-reservation", async (req, res) => {
    try {

        //update reservation status to denied
        db.collection("reservations").updateOne({ _id: new mongo.ObjectId(req.body.id) }, { $set: { status: "denied" } })

        //remove reservation from item's pendingList
        await db.collection("items").updateOne({ _id: new mongo.ObjectId(req.body.itemId) }, { $pull: { pendingList: { reservId: req.body.id } } })


        res.status(201).json({ success: true, data: "successfully denied reservation" });
    } catch (err) {
        res.status(404).json({ success: false, data: err.message })
    }
})

//FOR THE BORROWER: ets active reservation and item associated with that reservation
//returns:
/*
[{
    item: item
    reservation: reservation
}]
*/
router.get("/get-active-reservation/borrower/:userId", async (req, res) => {
    try {
        const user = await db.collection("users").findOne({ _id: new mongo.ObjectId(req.params.userId) });
        const activeReservations = [];
        for (const reservId of user.reservHist) {
            const reservation = await db.collection("reservations").findOne({ _id: new mongo.ObjectId(reservId) })
            if (reservation === null) continue;
            if (reservation.status === "approved" || reservation.status === "active") {
                const item = await db.collection("items").findOne({ _id: new mongo.ObjectId(reservation.itemId) })
                if (item != null) activeReservations.push({ item, reservation })
            }
        }
        if (activeReservations.length === 0) {
            res.status(201).json({ success: true, data: null });
        } else {
            res.status(201).json({ success: true, data: activeReservations });
        }

    } catch (err) {
        res.status(404).json({ success: false, data: err.message })
    }



})

//FOR THE LENDER: ets active reservation and item associated with that reservation
//returns:
/*
[{
    item: item
    reservation: reservation
}]
*/
router.get("/get-active-reservation/lender/:userId", async (req, res) => {
    try {
        const user = await db.collection("users").findOne({ _id: new mongo.ObjectId(req.params.userId) });
        const activeReservations = [];
        for (const itemId of user.postedItems) {
            const item = await db.collection("items").findOne({ _id: new mongo.ObjectId(itemId) })
            if (item && item.unavailList) {
                for (const unavail of item.unavailList) {
                    if (unavail.reservId) {
                        const reservation = await db.collection("reservations").findOne({ _id: new mongo.ObjectId(unavail.reservId) })
                        if (reservation && reservation.unavailList === null) continue;
                        if (reservation && (reservation.status === "approved" || reservation.status === "active")) {
                            const item = await db.collection("items").findOne({ _id: new mongo.ObjectId(reservation.itemId) })
                            activeReservations.push({ item, reservation })
                        }
                    }

                }
            }
        }
        if (activeReservations.length === 0) {
            res.status(201).json({ success: true, data: null });
        } else {
            res.status(201).json({ success: true, data: activeReservations });
        }

    } catch (err) {
        res.status(404).json({ success: false, data: err.message })
    }


})

//get all pending reservations for a user
//returns:
/*
[{
    item: item
    reservation: reservation
}]
*/
router.get('/get-pending-reservations-of-user/:userId', async (req, res) => {
    try {
        const user = await db.collection("users").findOne({ _id: new mongo.ObjectId(req.params.userId) });
        if (user === null) {
            throw new Error("user not found")
        }
        const pendingReservations = []
        for (const reservId of user.reservHist) {
            const reservation = await db.collection("reservations").findOne({ _id: new mongo.ObjectId(reservId) });
            if (reservation === null) {
                throw new Error("reservation not found");
            }
            if (reservation.status !== 'pending') {
                continue;
            }
            const item = await db.collection("items").findOne({ _id: new mongo.ObjectId(reservation.itemId) })
            if (item === null) {
                continue;
            }
            pendingReservations.push({ reservation, item })
        }
        res.status(201).json({ success: true, data: pendingReservations });
    } catch (err) {
        res.status(404).json({ success: false, data: err.message })
    }
})

// get completed reservation history for a user
router.get('/get-past-borrowing-reservations/:userId', async (req, res) => {
    try {
        const user = await db.collection("users").findOne({ _id: new mongo.ObjectId(req.params.userId) });
        if (user === null) {
            throw new Error("user not found")
        }
        const borrowedReservations = []
        for (const reservId of user.reservHist) {
            const reservation = await db.collection("reservations").findOne({ _id: new mongo.ObjectId(reservId) });
            if (reservation === null || reservation.status !== 'completed') continue;

            const item = await db.collection("items").findOne({ _id: new mongo.ObjectId(reservation.itemId) })
            if (item === null) continue;

            const lender = await db.collection("users").findOne({ _id: new mongo.ObjectId(item.ownerId) })
            if (lender === null) continue;

            borrowedReservations.push({ reservation, item, lender })
        }
        res.status(201).json({ success: true, data: borrowedReservations });
    } catch (err) {
        res.status(404).json({ success: false, data: err.message })
    }
})

// used to determine if you can review for a user or not
router.get("/get-past-lending-reservations/:userId/:borrowerId", async (req, res) => {
    try {
        const user = await db.collection("users").findOne({ _id: new mongo.ObjectId(req.params.userId) });
        const lendedReservations = [];
        for (const itemId of user.postedItems) {
            const item = await db.collection("items").findOne({ _id: new mongo.ObjectId(itemId) })
            if (item && item.reservHist) {
                for (const resvid of item.reservHist) {
                    const reservation = await db.collection("reservations").findOne({ _id: new mongo.ObjectId(resvid) })

                    if (reservation && reservation.unavailList === null) continue;
                    if (reservation && (reservation.status === "completed") && (reservation.borrowerId === req.params.borrowerId)) {
                        const borrower = await db.collection("users").findOne({ _id: new mongo.ObjectId(reservation.borrowerId) })
                        lendedReservations.push({ item, reservation, borrower })
                    }
                }
            }
        }
        if (lendedReservations.length === 0) {
            res.status(201).json({ success: true, data: null });
        } else {
            res.status(201).json({ success: true, data: lendedReservations });
        }
    } catch (err) {
        res.status(404).json({ success: false, data: err.message })
    }
})

router.get("/get-past-lending-reservations/:userId", async (req, res) => {
    try {
        const user = await db.collection("users").findOne({ _id: new mongo.ObjectId(req.params.userId) });
        const lendedReservations = [];
        for (const itemId of user.postedItems) {
            const item = await db.collection("items").findOne({ _id: new mongo.ObjectId(itemId) })
            if (item && item.reservHist) {
                for (const resvid of item.reservHist) {
                    const reservation = await db.collection("reservations").findOne({ _id: new mongo.ObjectId(resvid) })

                    if (reservation && reservation.unavailList === null) continue;
                    if (reservation && (reservation.status === "completed")) {
                        const borrower = await db.collection("users").findOne({ _id: new mongo.ObjectId(reservation.borrowerId) })
                        lendedReservations.push({ item, reservation, borrower })
                    }
                }
            }
        }
        if (lendedReservations.length === 0) {
            res.status(201).json({ success: true, data: null });
        } else {
            res.status(201).json({ success: true, data: lendedReservations });
        }
    } catch (err) {
        res.status(404).json({ success: false, data: err.message })
    }
})

//get reservation based on reservId
router.get("/get-reservation-by-id/:reservId", async (req, res) => {
    try {
        const reservation = await db.collection("reservations").findOne({ _id: new mongo.ObjectId(req.params.reservId) })
        if (reservation === null) {
            throw new Error("reservation not found")
        }
        res.status(201).json({ success: true, data: reservation })
    } catch (err) {
        res.status(404).json({ success: false, data: err.message })
    }
})

// get reservation based on reservId - with information about lender as well
router.get("/get-reservation-and-lender-by-id/:reservId", async (req, res) => {
    try {
        const reservation = await db.collection("reservations").findOne({ _id: new mongo.ObjectId(req.params.reservId) })
        if (reservation === null) {
            throw new Error("reservation not found")
        }

        const item = await db.collection("items").findOne({ _id: new mongo.ObjectId(reservation.itemId) },
            { ownerId: 1 }) // only get ownerId
        if (item === null) {
            throw new Error("item not found");
        }

        const lender = await db.collection("users").findOne({ _id: new mongo.ObjectId(item.ownerId) })
        if (lender === null) {
            throw new Error("lender not found");
        }

        res.status(201).json({ success: true, data: { reservation, lender } })
    } catch (err) {
        res.status(404).json({ success: false, data: err.message })
    }
})

//confirm that item was received
//req expected:
/*
{
    id: the reservation id
}
*/
router.put('/item-received', async (req, res) => {
    try {

        //update reservation status to active
        const update = await db.collection("reservations").updateOne({ _id: new mongo.ObjectId(req.body.id) }, { $set: { status: "active" } })

        if (update.modifiedCount === 1) {
            res.status(201).json({ success: true, data: "received" });
        } else if (update.matchedCount === 0) {
            throw new Error("no reservation matched that id")
        } else {
            res.status(201).json({ success: true, data: "received already, no update was needed" });
        }


    } catch (err) {
        res.status(404).json({ success: false, data: err.message })
    }
})

//confirm that item was returned
//req expected:
/*
{
    id: the reservation id
}
*/
router.put('/item-returned', async (req, res) => {
    try {

        //update reservation status to active
        const update = await db.collection("reservations").updateOne({ _id: new mongo.ObjectId(req.body.id) }, { $set: { status: "completed" } })
        const reservation = await db.collection("reservations").findOne({ _id: new mongo.ObjectId(req.body.id) });
        //remove from unavailList
        await db.collection("items").updateOne({ _id: new mongo.ObjectId(reservation.itemId) }, { $pull: { unavailList: { reservId: req.body.id } } })


        if (update.modifiedCount === 1) {
            res.status(201).json({ success: true, data: "returned" });
        } else if (update.matchedCount === 0) {
            throw new Error("no reservation matched that id")
        } else {
            res.status(201).json({ success: true, data: "returned already, no update was needed" });
        }
    } catch (err) {
        res.status(404).json({ success: false, data: err.message })
    }
})


//get user's reservation for that item 
//important to display for select item post page
//if no reservation exists, data = null
//a user should only have one active reservation for an item at any given moment
router.get("/get-user-reservation/user/:userId/item/:itemId", async (req, res) => {
    try {
        const reservations = await db.collection("reservations").find({ borrowerId: req.params.userId, itemId: req.params.itemId }).toArray();
        let activeReservation = null;
        let count = 0;
        for (const reservation of reservations) {
            //creates a deep copy of the endDate 
            //we set hours to 0, 0, 0, 0 to strictly compare dates
            const endDate = new Date(reservation.endDate);
            endDate.setHours(0, 0, 0, 0)

            const startDate = new Date(reservation.startDate);
            startDate.setHours(0, 0, 0, 0)

            const curDate = new Date(Date.now());
            curDate.setHours(0, 0, 0, 0)


            //we should only return one reservation per user per item
            if (reservation.status && (endDate >= curDate) && (reservation.status === 'active' || reservation.status === 'approved' || reservation.status === 'pending')) {
                activeReservation = reservation;
                count++;
            }
            if (count > 1) {
                throw new Error('Cannot have more than one active reservation at a time')
            }

        }
        res.status(200).json({ success: true, data: activeReservation });
    } catch (err) {
        res.status(404).json({ success: false, data: err.message })
    }

})

//MAY NOT NEED THIS GET REQUEST SINCE ITEM'S UNAVAILLIST AND PENDING LIST ALREADY HAVE ALL THE DATA WE NEED
//get all reservations of an item after today since we don't care about past reservations when it comes to calender unavailabilities
router.get("/get-item-reservations/item/:itemId", async (req, res) => {
    try {
        const item = await db.collection("items").findOne({ _id: new mongo.ObjectId(req.params.itemId) });
        const reservations = [];
        for (const id of item.reservHist) {

            const reservation = await db.collection("reservations").findOne({ _id: new mongo.ObjectId(id) });

            //creates a deep copy of the endDate 
            //we set hours to 0, 0, 0, 0 to strictly compare dates
            const endDate = new Date(reservation.endDate);
            endDate.setHours(0, 0, 0, 0)

            const curDate = new Date(Date.now());
            curDate.setHours(0, 0, 0, 0)

            if (endDate >= curDate) {
                reservations.push(reservation);
            }
        }

        res.status(200).json({ success: true, data: reservations });
    } catch (err) {
        res.status(404).json({ success: false, data: err.message })
    }
})


//delete reservation
router.delete("/delete-reservation/:reservId", async (req, res) => {
    try {
        const reservation = await db.collection("reservations").findOne({ _id: new mongo.ObjectId(req.params.reservId) });

        //remove reservation from item reservHist list and from item's unavailList and pendingList
        await db.collection("items").updateOne({ _id: new mongo.ObjectId(reservation.itemId) }, { $pull: { reservHist: req.params.reservId, unavailList: { reservId: req.params.reservId }, pendingList: { reservId: req.params.reservId } } });

        //remove reservation from user reservHist list
        await db.collection("users").updateOne({ _id: new mongo.ObjectId(reservation.borrowerId) }, { $pull: { reservHist: req.params.reservId } });

        await db.collection("reservations").deleteOne({ _id: new mongo.ObjectId(req.params.reservId) });

        res.status(200).json({ success: true, data: "reservation successfully deleted." })
    } catch (err) {
        res.status(404).json({ success: false, data: err.message })
    }
})

// get the pending list of an item + borrowers
router.get("/get-pending-reservations/:itemId", async (req, res) => {
    try {
        // get the item's pending list
        const item = await db.collection("items").findOne({ _id: new mongo.ObjectId(req.params.itemId) });

        const itemPendingList = item.pendingList;
        const result = [];

        for (const itemPL of itemPendingList) {
            const reserv = await db.collection("reservations").findOne({ _id: new mongo.ObjectId(itemPL.reservId) });
            const borrower = await db.collection("users").findOne({ _id: new mongo.ObjectId(reserv.borrowerId) });
            result.push({
                ...reserv,
                borrower: borrower
            });
        }
        res.status(200).json({ success: true, data: result });
    } catch (err) {
        console.log(err);
        res.status(404).json({ success: false, data: err.message })
    }
})


module.exports = router;