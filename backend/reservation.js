class Reservation {
    constructor(doc) {
        //if creating reservation for the first time, there won't be an id
        //if reading reservation object from mongodb, there will be an id
        if (doc._id != undefined) {
            this.id = JSON.stringify(doc._id).split('"')[1];
        } else {
            this.id = doc._id;
        }

        this.itemId = doc.itemId;
        this.borrowerId = doc.borrowerId;
        this.lenderId = doc.lenderId;
        this.requestPostId = doc.requestPostId;
        this.startDate = doc.startDate;
        this.endDate = doc.endDate;
        this.approvalStatus = doc.approvalStatus;
    }
}

module.exports = Reservation;