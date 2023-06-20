const levelFromString = require("../utils/level-from-string")
const dtFromString = require("../utils/date-time-from-update-string")

module.exports = (dt) => {
    const { post, river, level: levelString, dt: dtString } = dt
    const { level, mesurement } = levelFromString(levelString);

    return {
        post,
        river,
        level: mesurement === "м" ? +level * 10 : +level,
        _dt: dtFromString(dtString)
    }
}