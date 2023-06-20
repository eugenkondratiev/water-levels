const cheerio = require('cheerio');
const Nightmare = require('nightmare');
const LEVEL_POSTS_URL = "https://www.meteo.gov.ua/ua/Shchodenna-hidrolohichna-situaciya"
const getHtml = (selector) => document.querySelector(selector).innerHTML;

const bodySelecor = 'body';
const mapSelector = "#attns_map"
const popupSelector = "#attns_map  div.leaflet-popup"
// const popupSelector =  "#attns_map > div.leaflet-pane.leaflet-map-pane > div.leaflet-pane.leaflet-popup-pane > div.leaflet-popup"

const nightmare = Nightmare({
    show: true,
    webPreferences: {

        devTools: true,
        // preload: 'alertMessage.js',
        // nodeIntegration: false,
        webSecurity: false,
        allowRunningInsecureContent: true,
    },
    openDevTools: {
        /**
         * Opens the devtools with specified dock state, can be right, bottom, undocked, detach.
         * https://github.com/electron/electron/blob/master/docs/api/web-contents.md#contentsopendevtoolsoptions
         */
        mode: "right"
    }

})

function parsePosts(_url) {
    return new Promise((res, rej) => {
        nightmare
            .goto(_url)
            .wait(mapSelector)
            .wait(10000)
            .evaluate(getHtml, mapSelector)
            .then(response => {
                console.log("response-- ", response);
                return true
            })
            .then(data => {
                console.log("DATA- ", data);
                res(data)
            })
            .catch(err => {
                console.log("MAIN mightmare error", err);
                rej(err)
            })

    })
}



parsePosts(LEVEL_POSTS_URL).then(data => {
    console.log("MAIN THEN ", data);
}).catch(err => console.log("MAIN ERROR"))

