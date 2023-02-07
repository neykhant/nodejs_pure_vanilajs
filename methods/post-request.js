const requestBodyParser = require("../util/body-parser")
const writeToFile = require("../util/write-to-file")
const crypto = require("crypto")

module.exports = async (req, res) => {
    if (req.url === "/api/movies") {
        try {
            let body = await requestBodyParser(req)
            // console.log("req", body)
            body.id = crypto.randomUUID()
            req.movies.push(body)
            writeToFile(req.movies)
            res.writeHead(201, { "Content-Type": "Application/json" })
            res.end()
        } catch (error) {
            console.log(error)
            res.writeHead(400, { "Content-Type": "Application/json" })
            res.end(JSON.stringify({ title: "Not found", message: "Request Body is not validate" }))
        }
    } else {
        res.writeHead(404, { "Content-Type": "Application/json" })
        res.end(JSON.stringify({ title: "Not found", message: "Route not found" }))
    }
}
