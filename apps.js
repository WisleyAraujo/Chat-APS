const express = require('express')
const app = express()
const path = require('path')
const server = require('http').createServer(app)
const io = require('socket.io')(server)

server.listen(3000, () => {
  console.log('Aplicação em Execução...')
})

app.use(express.static(path.join(__dirname, 'public')))

let numUsers = 0

io.on('connection', (socket) => {
  let addedUser = false

  socket.on('new message', (data) => {
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data,
    })
  })

  socket.on('add user', (username) => {
    if (addedUser) return

    socket.username = username
    ++numUsers
    addedUser = true
    socket.emit('login', {
      numUsers: numUsers,
    })

    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers,
    })
  })

  socket.on('disconnect', () => {
    if (addedUser) {
      --numUsers

      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers,
      })
    }
  })
})
