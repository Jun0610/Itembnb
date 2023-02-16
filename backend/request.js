const Post = require('./post')

class Request extends Post{
    constructor(doc) {
        super(doc._id, doc.name, doc.description, doc.dateCreated, doc.ownerId)
        this.resolved_stat = doc.resolved_stat;
        this.recommended_items = doc.recommended_items;
    }
}

module.exports = Request;