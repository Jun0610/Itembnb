const { mongo } = require('./mongo')

async function getUserMin(db, userId) {
    try {
        const results = await db.collection('users').findOne({ _id: new mongo.ObjectId(userId) },
            // only get these fields
            { _id: 1, name: 1, profilePic: 1, profileDesc: 1 })

        if (results == null) {
            return null;
        } else {
            // trim description
            if (results.profileDesc && results.profileDesc.length > 45) {
                results.profileDesc = results.profileDesc.substring(0, 42).trim() + "...";
            }
            return results;
        }
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = {
    getUserMin: getUserMin
};