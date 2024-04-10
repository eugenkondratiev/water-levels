const schedule = require('node-schedule');
const ruleEveryDay = {
    hour: 10,
    minute: 11,
    second: 12
};

const archRule = {
    dayOfWeek:0,
    hour: 12,
    minute: 58,
    second: 24
}

const fs = require('fs')
require('dotenv').config()
const archiver = require('archiver')

const fetchLevels = require("./puppeteer");

async function zipLogs() {

    const dt = new Date()

    const currentDayString = dt.toLocaleDateString("ua-UA").split('.').reverse().join('-')
    const zipPath = `D:\\JS\\water\\data`


    const output = fs.createWriteStream(zipPath + `/ziplog${currentDayString}.zip`)
    const archive = archiver('zip', {
        zlib: { level: 9 }
    })

    output.on('close', () => {
        console.log('DELETE jsons after zipping')

        try {
            fs.readdirSync(zipPath).forEach(file => {
                if (file.match(/\.json/)) {
                    fs.unlinkSync(zipPath + "\\" + file)
                }
            })

        } catch (error) {
            console.log('read files error- ', error)
        }


    })

    output.on('end', () => {
        console.log('jsons has zipped and deleted')
    })

    archive.on('error', (err) => {
        throw err
    })

    archive.on('warning', (err) => {
        if (err.code === 'ENOENT') {
            console.log("ENOENT")
        }
        else {
            // throw err
            console.log("#####warning - ", err.code, err)
        }
    })


    archive.pipe(output)
    archive.glob('*.json', { cwd: zipPath })
    await archive.finalize()

}





// Start the scraping

// fetchLevels().catch(err => { console.log("MAIN ERROR  - ", err) });

module.exports = function () {


    const rltZipDumps = schedule.scheduleJob(archRule, async function () {
        try {
            const ans1 = await zipLogs();
            console.log("  json logged. result : " + ans1 + "\n");
        } catch (error) {
            console.log("  json NOT logged.. error : " + error.message + "\n");

        }
    })

    const schGetPlayers = schedule.scheduleJob(ruleEveryDay, async function () {
        try {
            const ans2 = await fetchLevels();
            console.log("  day data checked. result : " + ans2 + "\n");
        } catch (error) {
            console.log("  day data checked. error : " + error.message + "\n");

        }
    });
}