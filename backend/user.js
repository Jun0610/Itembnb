class User {
    constructor(doc) {
        //if creating User for the first time, there won't be an id
        //if reading User object from mongodb, there will be an id
        if (doc._id != undefined) {
            this.id = JSON.stringify(doc._id).split('"')[1];
        } else {
            this.id = doc._id;
        }
        this.email = doc.email;
        this.name = doc.name;
        this.password = doc.password;
        this.favoritedItems = doc.favoritedItems;
        this.postedItems = doc.postedItems;
        this.postedRequests = doc.postedRequests;
        //have to handle image somehow
        this.profileDesc = doc.profileDesc;
        this.resrvationHist = doc.resrvationHist;
        this.borrowerRating = doc.borrowerRating;
        this.lenderRating = doc.lenderRating;2
    }
}

module.exports = User;