const express = require('express');
const app = express()
const cors = require('cors')
const server = require('http').createServer(app);
const fs = require('fs');
const os = require('os');
const path = require('path');

app.use(cors())

// if a file is requested, check the filename query parameter and send the file
app.get('/file', async function (req, res, next) {
  var fileName = req.query.filename
  if (typeof fileName === 'undefined') {
    res.send(`no filename given`)
    return
  }
  try {
    res.sendFile(fileName, function (err) {
      if (err) {
        next(err)
      } else {
      }
    })
  } catch (error) {
    res.send(`file not found: ${fileName}`)
  }

})


class FileServer {
  // 0 will result in a random open port being assigned 
  constructor(port = 0) {
    this.port = port
  }

  start() {
    this.server = server.listen(this.port)
    this.port = this.server.address().port // update port reference if it was randomly assigned
    console.log(`fileServer listening at http://localhost:${this.port}`)
    process.send = process.send || function () {}
    process.send(
      { 
        type: 'fileServerPort',
        value: this.port
      }
    )
    return this
  }

  quit() {
    this.server.close((err) => {
      process.exit(err ? 1 : 0)
    })
  }
}

module.exports.FileServer = FileServer

const fileServer = new FileServer()
fileServer.start()
