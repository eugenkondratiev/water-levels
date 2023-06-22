module.exports = (data) => {
    if (!Array.isArray(data)) return null

    return data.map(d => {
        return {
            dt: d._dt,
            level: d.level
        }
    })
}