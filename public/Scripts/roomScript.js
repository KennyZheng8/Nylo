
window.onload = function() {

  document.getElementById('userName').innerHTML = generateUserName()  
}

function generateUserName() {
  var file = "../Data/userNames.txt";
  $.ajax({
    url: file,
    type: 'get',
    dataType: 'text',
    async: false,
    success: function(data) {
      userNames = data.split("\n");
      userName = userNames[Math.floor(Math.random() * userNames.length)];
    }
  });
  return userName
}