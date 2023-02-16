const Post = require("./post")
const Review = require("./review")


class Item extends Post {
    constructor(doc) {
        super(doc._id, doc.name, doc.description, doc.dateCreated, doc.ownerId)
        this.price = doc.price;
        //need to handle images
        this.revservHist = doc.revservHist;
        this.unavailList = doc.unavailList;
        this.review = []
        doc.review.forEach((review) => {
            console.log(review)
            this.review.push(new Review(review))
        })
        this.category = doc.category
    }

}

const Category = {
    ACADEMICS: "Acaademics",
    HOUSEHOLD : "Household",
    ENTERTAINMENT: "Entertainment",
    OUTDOOR: "Outdoor",
    ELECTRONIC: "Electronic",
    MISC: "Misc",
}


module.exports = {Item, Category};

