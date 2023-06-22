require("./scheduler")()

setTimeout(async () => {
    // const rlt = await require("./controller/read-post-data")()
    const rlt = await require("./controller/read-post-data")({ post: "Заліщики", river: 'Дністер' })
    // const rlt = await require("./model/read-data")({ post: "Устеріки" })

    console.log("TEST READ ", rlt)

    // const posts = await require("./controller/read-rivers-list")({ _id: -1 })

    // console.log("POSTS ", posts)

    // const failRead = await require("./model/read-data")({ post: "OLOLO" })

    // console.log("fail READ ", failRead)

}, 1000)


