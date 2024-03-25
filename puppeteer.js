const fs = require("fs");
const puppeteer = require("puppeteer");
const LEVEL_POSTS_URL = "https://www.meteo.gov.ua/ua/Shchodenna-hidrolohichna-situaciya"
// const getHtml = (selector) => document.querySelector(selector).innerHTML;

const bodySelecor = 'body';
const mapSelector = "#attns_map"
const popupSelector = "#attns_map  div.leaflet-popup-pane div.leaflet-popup-content"
const firstPostSeletor = "#attns_map > div.leaflet-pane.leaflet-map-pane > div.leaflet-pane.leaflet-marker-pane > div:nth-child(1) > div"
const allPostsSeletor = "#attns_map > div.leaflet-pane.leaflet-map-pane > div.leaflet-pane.leaflet-marker-pane  div.hmhm"
const temperaturenSelector = "#attns_map > div.leaflet-pane.leaflet-map-pane > div.leaflet-pane.leaflet-popup-pane > div > div.leaflet-popup-content-wrapper > div > div:nth-child(6) > b"
const closePopupSelector = "a.leaflet-popup-close-button"
const sleep = (ms) => { return new Promise(res => setTimeout(res, ms)) }


const upsertRecordToMongo = require("./model/upsert-record-to-db")
const upsertRiversToMongo = require("./model/update-rivers-list")

const formMongoRecord = require("./model/form-mongo-record")
const formRiversList = require("./utils/rivers-set-object")

function checkIfPostUnique(postsData, newPost) {
    if (!Array.isArray(postsData)) return false
    if (postsData.some(p => p.post === newPost.post && p.river === newPost.river)) return false
    return true
}


const getLevels = async () => {
    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null,
    });

    const page = await browser.newPage();

    await page.goto(LEVEL_POSTS_URL, {
        waitUntil: "domcontentloaded",
        // waitUntil: "domcontentloaded",
    });
    const postsList = await page.$$(allPostsSeletor)
    // const postsList = await page.$$eval(allPostsSeletor, divs => divs)
    const postsQuantity = postsList.length
    console.log("POST LISTS Quantity- ", postsQuantity);

    let postsData = [];

    for (let i = 0; i < postsQuantity; i++) {
        try {
            console.log("posts = ", i, postsList[i]);
            postsList[i].click()
            await sleep(2000)

            const popup = await page.$(popupSelector)
            const post = await popup.$eval('div:nth-child(1) > b', x => x.textContent)
            const river = await popup.$eval('div:nth-child(2) > b', x => x.textContent)
            const dt = await popup.$eval('div:nth-child(3) em', x => x.textContent)
            const level = await popup.$eval('div:nth-child(4) b', x => x.textContent)
            const levelChange = await popup.$eval('div:nth-child(5) b', x => x.textContent)

            const e3 = await page.$eval(popupSelector, div => div.innerHTML)
            const levelData = {
                post,
                river,
                dt,
                level,
                levelChange,
                // temperaturen

            }
            console.log("levelData -", levelData, "\n\n\n", e3);


            if (checkIfPostUnique(postsData, levelData)) {
                postsData.push(levelData)
                upsertRecordToMongo(formMongoRecord(levelData))

            }

            const popupClose = await page.$(closePopupSelector)
            popupClose.click() 
            await sleep(2000)
        } catch (error) {
            console.log("one post error", error);
        }
    }

    console.log(" postsData  - ", postsData);
    console.log(" postsData Length - ", postsData.length);
    fs.writeFile(`./data/postList_${new Date(Date.now()).toLocaleDateString()}.json`, JSON.stringify(postsData, null, " "), 'utf8', (err) => { if (err) console.log("error postList file writing ", err) })


    const riversList = await formRiversList(postsData)
    await upsertRiversToMongo(riversList)


    fs.writeFile(`./data/riversList_${new Date(Date.now()).toLocaleDateString()}.json`, JSON.stringify(riversList, null, " "), 'utf8', (err) => { if (err) console.log("error riversList. file writing ", err) })




    setTimeout(async () => {
        await browser.close()

    }, 3000)

    return postsData.length;
};

module.exports = getLevels


