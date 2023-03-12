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
router.post("/make-reservation", async (req, res) => {
    try {
        //add reservation to reservations collection

        //need to store dates in mongoDB
        req.body.startDate = new Date(req.body.startDate);
        req.body.endDate = new Date(req.body.endDate);

        //a reservation status is always pending initially
        req.body.status = 'pending';
        const results = await db.collection("reservations").insertOne(req.body);
        const reservId = results.insertedId.toString();

        //add reservation id to item's reservHist and reservation dates to item's pendingList
        await db.collection("items").updateOne({ _id: new mongo.ObjectId(req.body.itemId) }, { $push: { reservHist: reservId, pendingList: { startDate: req.body.startDate, endDate: req.body.endDate, reservId: reservId } } });

        //add reservation id to user's reservHist
        await db.collection("users").updateOne({ _id: new mongo.ObjectId(req.body.userId) }, { $push: { reservHist: reservId } });

        //send back the data if successful
        res.status(201).json({ success: true, data: "successfully added reservation" });

    } catch (err) {
        res.status(404).json({ success: false, data: err.message })
    }

})

//approve reservation
router.put("/approve-reservation/item/:itemId", async (req, res) => {
    try {

        //update reservation status to approved
        db.collection("reservations").updateOne({ _id: new mongo.ObjectId(req.body.id) }, { status: "approved" })

        //remove reservation from item's pendingList
        await db.collection("items").updateOne({ _id: new mongo.ObjectId(req.params.itemId) }, { $pull: { pendingList: { reservId: req.body.id } } })

        //then add reservation to item's unavailList
        await db.collection("items").updateOne({ _id: new mongo.ObjectId(req.params.itemId) }, { $push: { unavailList: { startDate: req.body.startDate, endDate: req.body.endDate, reservId: req.body.id } } })

        res.status(201).json({ success: true, data: "successfully approved reservation" });
    } catch (err) {
        res.status(404).json({ success: false, data: err.message })
    }
})

//deny reservation


//activate reservation


//get user's reservation for that item
//if no reservation exists, data = null
//a user should only have one active reservation for an item at any given moment
router.get("/get-user-reservation/user/:userId/item/:itemId", async (req, res) => {
    try {
        const reservations = await db.collection("reservations").find({ userId: req.params.userId, itemId: req.params.itemId }).toArray();
        let activeReservation = null;
        let count = 0;
        for (reservation of reservations) {
            //creates a deep copy of the endDate 
            //we set hours to 0, 0, 0, 0 to strictly compare dates
            const endDate = new Date(reservation.endDate);
            endDate.setHours(0, 0, 0, 0)

            const curDate = new Date(Date.now());
            curDate.setHours(0, 0, 0, 0)


            //we should only return one reservation per user per item
            if (reservation.status && endDate >= curDate && reservation.status === 'active' || reservation.status === 'approved' || reservation.status === 'pending') {
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
        await db.collection("users").updateOne({ _id: new mongo.ObjectId(reservation.userId) }, { $pull: { reservHist: req.params.reservId } });

        await db.collection("reservations").deleteOne({ _id: new mongo.ObjectId(req.params.reservId) });

        res.status(200).json({ success: true, data: "reservation successfully deleted." })
    } catch (err) {
        res.status(404).json({ success: false, data: err.message })
    }
})


module.exports = router;