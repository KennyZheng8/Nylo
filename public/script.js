$("#roomId").on('change keydown paste input', function(){
  if ($("#roomId").val() == '') {
      $("#createBotton").html("Create New Room");
  } else {
      $("#createBotton").html("Join Room");
  }
});

const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const profileGrid = document.getElementById('profile-grid')
const myPeer = new Peer(undefined, {
  host: '/',
  port: '3001'
})

const myVideo = document.createElement('video')
const myProfile = document.createElement('profile')

myVideo.muted = true
const peers = {}

navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  addVideoStream(myVideo, stream)

  myPeer.on('call', call => {
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
  })

  socket.on('user-connected', userId => {
    connectToNewUser(userId, stream)
  })
})

socket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close()
})

myPeer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id)
})

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream)
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
  })
  call.on('close', () => {
    video.remove()
  })

  peers[userId] = call
}

function addVideoStream(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoGrid.append(video)
}

function joinRoom() {
  if ($("#roomId").val() == '') {
    roomName = generateRoomName();
    window.open("Nylo/" + roomName, "_self");
  } else {
    window.open("Nylo/" + $("#roomId").val(), "_self");
  }
}

// Generate random room name from roomNames.txt + 4 digits number
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

function generateUsername() {
  var file ="names/userNames.txt";
  $.ajax({
    url: file,
    type: 'get',
    dataType: 'text',
    async: false,
    success: function(data) {
      userNames = data.split("\n");
      userName = userNames[Math.floor(Math.random() * usernames.length)];
    }
  });
  return userName;
}

