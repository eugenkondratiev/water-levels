
module.exports = (updateString) => {
    const [_date, _time, ...rest] = updateString.replace("Дані на ", "").split(" ")
    const [dd, mn, yyyy] = _date.replace(",", "").split(".")
    const [hh, mm] = _time.split(":")

    return new Date(yyyy, +mn - 1, dd, hh, mm)

}