const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')

app.set('view engine', 'ejs')
app.use(express.static('public'))

// app.get('/', (req, res) => {
//   res.redirect(`/${uuidV4()}`)
// })

// app.get('/:room', (req, res) => {
//   res.render('room', { roomId: req.params.room })
// })

app.get('/', (req, res) => {
  res.redirect(`/Nylo`)
})

app.get('/Nylo', (req, res) => {
  res.render('home')
})

app.get('/Nylo/:room', (req, res) => {
  res.render('room', {roomId: req.params.room})
})

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    socket.broadcast.to(roomId).emit('user-connected', userId)

    socket.on('disconnect', () => {
      socket.broadcast.to(roomId).emit('user-disconnected', userId)
    })
  })
})

server.listen(3000)

function generateRoomName() {
  var file = "roomNames.txt";
  $.ajax({
    url: file,
    type: 'get',
    dataType: 'text',
    async: false,
    success: function(data) {
      roomNames = data.split("\n");
      roomName = roomNames[Math.floor(Math.random() * roomNames.length)];
      number = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
    }
  });
  return roomName + number;
}