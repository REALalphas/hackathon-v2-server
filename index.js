const fastify = require('fastify')
const app = fastify()

app.get('/', (req, res) => {
    res.send('hi')
})

app.listen({
    host: '0.0.0.0',
    port: 3000
})