require('dotenv').config()
const express = require('express')
const router = express.Router()
const errorhandler = require('errorhandler')
const https = require('https')
const helmet = require('helmet')
const cors = require('cors')
const bodyParser = require('body-parser')
const fs = require('fs')
const {
  logger
} = require('./lib/logger')

const app = express()
app.use(helmet())
app.use(cors())
app.use(
  bodyParser.urlencoded({
    extended: false,
  }),
)
app.use(bodyParser.json())

const isProduction = process.env.NODE_ENV === 'production'

if (!isProduction) {
  app.use(errorhandler())
}

app.use(require('./routes'))

app.use((req, res, next) => {
  let err = new Error('Not Found')
  err.status = 404
  logger.log('error', 'Error Not Found', {
    err,
  })
  next(err)
})

if (!isProduction) {
  app.use((err, req, res, next) => {
    console.log(err.stack)

    res.status(err.status || 500)

    res.json({
      errors: {
        message: err.message,
        error: err,
      },
    })
  })
} else {
  // production error handler
  // no stacktraces leaked to user
  app.use(function (err, req, res, next) {
    res.status(err.status || 500)
    res.json({
      errors: {
        message: err.message,
        error: {},
      },
    })
  })
}

// http
if (process.env.NODE_ENV === 'development') {
  logger.log('info', 'dev env', {
    env: process.env,
  })
  let server = app.listen(process.env.PORT || 3000, function () {
    console.log('Listening on port ' + server.address().port)
  })
} else {
  const sslOptions = {
    key: fs.readFileSync('./ssl/server.key'),
    cert: fs.readFileSync('./ssl/server.cer'),
  }

  logger.log('info', 'prod env', {
    env: process.env,
  })

  https.createServer(sslOptions, app).listen(process.env.PORT || 3000, () => {
    console.log(`Listening on ${process.env.PORT}`)
  })
}

module.exports = router
module.exports = app