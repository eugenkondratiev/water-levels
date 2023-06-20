// const levelFromString = require("./utils/level-from-string")
// const dtFromString = require("./utils/date-time-from-update-string")
const mongoRecordFromString = require("./model/form-mongo-record")
const upsertRecord = require("./model/upsert-record_to-db")

const test = [{
    post: 'Новгород Сіверський',
    river: 'Десна',
    dt: 'Дані на 19.06.2023, 08:00',
    level: '218 см. (122.16 м БС)',
    levelChange: 'зменшився на 1 см.'
},
{
    post: 'Розльоти',
    river: 'Десна',
    dt: 'Дані на 19.06.2023, 08:00',
    level: '298 см. (118.36 м БС)',
    levelChange: 'зменшився на 1 см.'
},
{
    post: 'Макошине',
    river: 'Десна',
    dt: 'Дані на 19.06.2023, 08:00',
    level: '236 см. (111.12 м БС)',
    levelChange: 'зменшився на 2 см.'
}]

async function main() {

    test.forEach(p => {
        console.log(mongoRecordFromString(p));


    })
    for (let i = 0; i < test.length; i++) {
        await upsertRecord(mongoRecordFromString(test[i]))

    }
}



main().catch(err => console.log(err))
