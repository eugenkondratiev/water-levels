module.exports = async () => {
    const posts = await require("../model/read-data")({ _id: -1 })
    const { _id, ...rivers } = posts[0]
    return rivers
}