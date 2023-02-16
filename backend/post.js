class Post {
    constructor(id, name, description, dateCreated, ownerId) {
        //if creating Post for the first time, there won't be an id
        //if reading Post object from mongodb, there will be an id
        if (id != undefined) {
            this.id = JSON.stringify(id).split('"')[1]
        } else {
            this.id = id;
        }
        this.name = name;
        this.description = description;
        this.dateCreated = dateCreated;
        this.ownerId = ownerId;
    }
}

module.exports = Post;
