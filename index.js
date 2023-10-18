const path = require('node:path')

const csvdb = require('node-csv-query').default
let databaseConnection = null

csvdb(__dirname + '/250.csv').then((db) => {
    databaseConnection = db
    console.log('Connected to database!')
})

const fastifyStatic = require('@fastify/static')
const fastify = require('fastify')
const app = fastify()

app.register(fastifyStatic, {
    root: path.join(__dirname, 'static'),
    prefix: "/test/"
})

app.get('/', (req, res) => {
    res.send('hi')
})


numberInRange = (num, low, high) => {
    if (num > low && num < high) {
        return true
    }
    return false
}

app.get('/getstations/:lat/:lng', (req, res) => {
    if (!databaseConnection) res.code(503).send('Wait for database connection')
    let { lat, lng } = req.params

    lat = Number(lat)
    lng = Number(lng)

    databaseConnection.find((record) => {
        delete record.MCC
        delete record.MNC
        delete record['LAC/TAC/NID']
        delete record.Nullable
        delete record.test
        delete record.Samples
        delete record.Changeable
        delete record.Created
        delete record.Updated
        delete record.AverageSignal
        delete record.Range

        return (numberInRange(record.Latitude, lat - 0.05, lat + 0.05)
            && numberInRange(record.Longitude, lng - 0.05, lng + 0.05))
    }).then((records) => {
        res.send(records)
        // console.log(records)
    })
})

app.listen({
    host: '0.0.0.0',
    port: 3000
})