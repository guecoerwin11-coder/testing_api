require('dotenv').config()
const express = require('express')
const swaggerUi = require('swagger-ui-express')
const swaggerSpec = require('../swagger')

const app = express()
app.use(express.json())

// routes
app.use('/auth', require('./routes/auth'))


//swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar {display: none}',
    customSiteTitle: 'My API Docs'
}))

//expose raw JSON spec
app.use('/api-docs.json', (req, res) => {
    res.json(swaggerSpec)
})


// error handler
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({ message: err.message })
})

module.exports = app