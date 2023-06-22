module.exports = async (options = {}) => {
    const { post: _post = "Устеріки", river: _river = "Черемош" } = options

    // const rlt = await require("./model/read-data")({ post: "Устеріки" })
    const data = await require("../model/read-data")({ $and: [{ post: _post }, { river: _river }] })
    console.log("ONE POST data ########## ", data)
    return require("./form-levels-array")(data)

}