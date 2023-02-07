
const requestBodyParser = require("../util/body-parser")
const writeToFile = require("../util/write-to-file")
const crypto = require("crypto")

module.exports = async (req, res) => {
    let baseUrl = req.url.substring(0, req.url.lastIndexOf("/") + 1)
    // console.log(baseUrl)
    let id = req.url.split("/")[3]
    // console.log("id", id)
    const regexV4 = new RegExp(
        /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
    );
    if (!regexV4.test(id)) {
        res.writeHead(400, { "Content-Type": "Application/json" })
        res.end(JSON.stringify({ title: "Validation Fail", message: "UUID is not valid" }))
    } else if (baseUrl === "/api/movies/" && regexV4.test(id)) {
        try {
            let body = await requestBodyParser(req)
            const index = req.movies.findIndex((m) => {
                return m.id === id
            })

            if (index === -1) {
                res.statusCode = 404;
                res.write(JSON.stringify({ title: "Not found", message: "Movie not found" }))
                res.end()
            } else {
                req.movies[index] = { id, ...body }
                writeToFile(req.movies)
                res.writeHead(200, { "Content-Type": "Application/json" })
                res.end(JSON.stringify(req.movies[index]))
            }

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
