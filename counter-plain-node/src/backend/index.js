import http from 'http'

const PORT = 3000

let data = {count: -3}

const COUNT_URL = '/api/count'
const COUNT_WITH_PAYLOAD_URL = /\/api\/count\/([+-]?[0-9]+)/

function setJson(res) {
    res.setHeader('Content-Type', 'application/json')
}

const server = http.createServer((req, res) => {
    const {url, method} = req
    try {
        if (url === COUNT_URL) {
            switch (method) {
                case 'GET':
                    res.statusCode = 200
                    setJson(res)
                    res.end(JSON.stringify(data))
                    return
                default:
                    throw 'unsupported method on count'
            }
        }

        const setCountMatch = url.match(COUNT_WITH_PAYLOAD_URL)
        if (setCountMatch !== null) {
            switch (method) {
                case 'PUT':
                    res.statusCode = 200
                    setJson(res)
                    const count = Number(setCountMatch[1])
                    if (!isNaN(count) && count >= -10 && count <= 10) {
                        data = {...data, count}
                    }
                    res.end(JSON.stringify(data))
                    return
                default:
                    throw 'unsupported method on count'
            }
        }
    } finally {
        res.statusCode = 404
        res.end()
    }
})

server.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})