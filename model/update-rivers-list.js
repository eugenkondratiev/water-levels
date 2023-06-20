async function insertToMongo(riversList) {
    let mongoClient;
    // const collection = mongoClient._db.collection(COLLECTION);
    try {
        mongoClient = await require('./db-mongo')();

        const rlt = await mongoClient
            ._db
            .collection("posts")
            .updateOne(
                {
                    _id: -1
                },
                {
                    $set: {
                        _id: -1,
                        ...riversList
                    }
                },
                { upsert: true }
            );
        // console.log('##### HOST ####', dbSeason);
    } catch (err) {
        console.log("insertToMongo errro", err);
        mongoClient.client.close();
    }
    finally {
        mongoClient.client.close();
        ;
        // setTimeout(() => {
        // }, 5000);
    }
}

module.exports = insertToMongo;