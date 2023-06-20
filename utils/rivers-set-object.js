module.exports = (posts) => {
    if (!Array.isArray(posts)) return { nodata }
    const rivers = {}
    posts.forEach(p => {
        if (rivers[p.river]) {
            rivers[p.river].push(p.post)
        } else {
            rivers[p.river] = [p.post]
        }
    })
    return { ...rivers }
}
