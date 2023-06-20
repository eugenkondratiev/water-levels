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

const sleep = (ms) => { return new Promise(res => setTimeout(res, ms)) }


const upsertRecordToMongo = require("./model/upsert-record_to-db")
const formMongoRecord = require("./model/form-mongo-record")

function checkIfPostUnique(postsData, newPost) {
    if (!Array.isArray(postsData)) return false
    if (postsData.some(p => p.post === newPost.post && p.point === newPost.point)) return false
    return true
}


const getQuotes = async () => {
    // Start a Puppeteer session with:
    // - a visible browser (`headless: false` - easier to debug because you'll see the browser in action)
    // - no default viewport (`defaultViewport: null` - website page will in full width and height)
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
    });

    // Open a new page
    const page = await browser.newPage();

    // On this new page:
    // - open the "http://quotes.toscrape.com/" website
    // - wait until the dom content is loaded (HTML is ready)
    await page.goto(LEVEL_POSTS_URL, {
        waitUntil: "domcontentloaded",
        // waitUntil: "domcontentloaded",
    });
    const postsList = await page.$$(allPostsSeletor)
    // const postsList = await page.$$eval(allPostsSeletor, divs => divs)
    const postsQuantity = postsList.length
    console.log("POST LISTS - ", postsQuantity, postsList);

    let postsData = [];

    for (let i = 0; i < postsQuantity; i++) {
        try {
            console.log("posts = ", i, postsList[i]);
            postsList[i].click()
            await sleep(1000)
            // const e1 = await page.$eval(popupSelector, d => d.textContent)
            // const e2 = await page.$eval(popupSelector, d => d.outerHTML)
            // const e3 = await page.$eval(popupSelector, async d => {
            //     const post = await d.$eval('div[text="bar"] b', x => x.textContent)
            //     console.log("post", post);
            //     return d.innerHTML

            // }
            // )


            // }
            let isTempExist = null

            const popup = await page.$(popupSelector)
            const post = await popup.$eval('div:nth-child(1) > b', x => x.textContent)
            const river = await popup.$eval('div:nth-child(2) > b', x => x.textContent)
            const dt = await popup.$eval('div:nth-child(3) em', x => x.textContent)
            const level = await popup.$eval('div:nth-child(4) b', x => x.textContent)
            const levelChange = await popup.$eval('div:nth-child(5) b', x => x.textContent)
            // try {

            //     isTempExist = await page.$(temperaturenSelector)
            // } catch (error) {

            // }
            // const temperaturen = isTempExist ? await popup.$eval(temperaturenSelector, x => x.textContent) : null

            const e3 = await page.$eval(popupSelector, div => div.innerHTML)
            const levelData = {
                post,
                river,
                dt,
                level,
                levelChange,
                // temperaturen

            }
            console.log(levelData, "\n\n\n", e3);


            // console.log(e1, "\n\n\n", e2, "\n\n\n", e3);
            if (checkIfPostUnique(postsData, levelData)) {
                postsData.push(levelData)
                upsertRecordToMongo(formMongoRecord(levelData))

            }
            await page.$eval(popupSelector, div => {
                console.log(div.textContent);
            })
            await sleep(1000)
        } catch (error) {
            console.log("one post error", error);
        }
    }

    console.log(" postsData  - ", postsData);
    console.log(" postsData Length - ", postsData.length);

    fs.writeFile("./data/postList.json", JSON.stringify(postsData, null, " "), 'utf8', (err) => console.log("error file writing ", err))

    setTimeout(async () => {
        await browser.close()

    }, 10000)
};

// Start the scraping
getQuotes().catch(err => { console.log("MAIN ERROR  - ", err) });

