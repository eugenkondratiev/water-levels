module.exports = async (posts) => {
    if (!Array.isArray(posts)) return { nodata }
    console.log("READ river list")
    const rivers = await require("../controller/read-rivers-list")();

    console.log("old  rivers list", rivers.length)


    // const rivers = {}
    posts.forEach(p => {
        if (rivers[p.river]) {
            if (!rivers[p.river].some(post => post === p.post)) rivers[p.river].push(p.post)
        } else {
            rivers[p.river] = [p.post]
        }
    })
    console.log("new  rivers list", rivers.length)

    return { ...rivers }
}
