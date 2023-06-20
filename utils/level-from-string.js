// level: '96 см. (551.72 м БС)',

module.exports = (levelString) => {
    const [level, mesurement, ...rest] = levelString.split(" ")
    return { level, mesurement }
}
