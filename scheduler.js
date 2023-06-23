const schedule = require('node-schedule');
const ruleEveryDay = {
    hour: 10,
    minute: 11,
    second: 12
};

const fetchLevels = require("./puppeteer");


// Start the scraping

fetchLevels().catch(err => { console.log("MAIN ERROR  - ", err) });

module.exports = function () {
    const schGetPlayers = schedule.scheduleJob(ruleEveryDay, async function () {
        try {
            const ans2 = await fetchLevels();
            console.log("  day data checked. result : " + ans2 + "\n");
        } catch (error) {
            console.log("  day data checked. error : " + error.message + "\n");

        }
    });
}