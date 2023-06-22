async function readFromMongo(query = {}, options = {}) {
    let mongoClient;
    // const collection = mongoClient._db.collection(COLLECTION);
    let rlt
    try {
        mongoClient = await require('./db-mongo')();
        if (await mongoClient._db.collection("posts").countDocuments(query) === 0) {
            rlt = []
        }


        rlt = await mongoClient
            ._db
            .collection("posts")
            .find(
                query,
                options
            ).toArray();


    } catch (err) {
        console.log("readFromMongo error", err);
        rlt = null

        mongoClient.client.close();
    }
    finally {
        mongoClient.client.close();
        return rlt
    }
}

module.exports = readFromMongo;