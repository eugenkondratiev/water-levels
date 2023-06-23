require("./scheduler")()
require('dotenv').config()

setTimeout(async () => {
    // const rlt = await require("./controller/read-post-data")()


    // const rlt = await require("./controller/read-post-data")({ post: "Заліщики", river: 'Дністер' })

    // const rlt = await require("./model/read-data")({ post: "Устеріки" })

    // console.log("TEST READ ", rlt)

    // const posts = await require("./controller/read-rivers-list")({ _id: -1 })

    // console.log("POSTS ", posts)

    // const failRead = await require("./model/read-data")({ post: "OLOLO" })

    // console.log("fail READ ", failRead)

}, 1000)
function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

const PORT = normalizePort(process.env.PORT || '3000');
const HOSTNAME = process.env.HOST || '192.168.1.185' || 'localhost';

const http = require("http")
const url = require('url')

const server = http.createServer(async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', "*")
    res.setHeader('Access-Control-Allow-Headers', "*")
    res.setHeader('Access-Control-Request-Method', "*")


    if ((req.url === "/api" || req.url === "/api/rivers") && req.method === "GET") {
        try {
            const posts = await require("./controller/read-rivers-list")({ _id: -1 })
            res.setHeader('Access-Control-Allow-Origin', "*")

            res.writeHead(200, { "Content-Type": "application/json" })
            res.end(JSON.stringify(posts, null, " "))

        } catch (error) {
            res.writeHead(404, { "Content-Type": "application/json" })
            res.end(JSON.stringify({ message: error }))

        }
    }
    else if ((req.url.match("/api/post")) && req.method === "GET") {
        try {
            console.log("/api/post")
            const parsedUrl = url.parse(req.url, true)
            const { post, river } = parsedUrl.query;

            console.log(" post, river ", post, river)

            const rlt = await require("./controller/read-post-data")({ post: post, river: river })
            res.setHeader('Access-Control-Allow-Origin', "*")

            res.writeHead(200, { "Content-Type": "application/json" })
            res.end(JSON.stringify(rlt, null, " "))

        } catch (error) {
            res.writeHead(404, { "Content-Type": "application/json" })
            res.end(JSON.stringify({ message: error }))

        }
    }
    else {
        console.log("ERROR URL ", req.url)

        res.writeHead(404, { "Content-Type": "application/json" })
        res.end(JSON.stringify({ message: "Such route or data was NOT found" }))
    }
})

server.listen(PORT, () => {
    console.log(`server on listens to port ${PORT}`)
})


