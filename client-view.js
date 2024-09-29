ZoomMtg.preLoadWasm()
ZoomMtg.prepareWebSDK()

var authEndpoint = 'http://localhost:4000/zoom_auth_jwt'
var sdkKey = '4EvPaJwQTl6lpYmcAeqFg'
var meetingNumber = '93362050842'
var passWord = '123456'
var role = 1
var userName = '65b0d02d60023489a81394db'
var userEmail = 'masum@gmail.com'
var registrantToken = ''
var zakToken = 'aDFImFLu0idYeKfnun-TSKg517Sg0Ff8g'
var leaveUrl = 'http://127.0.0.1:5500/'

function getSignature() {
  console.log("PROCESS ENV::: ", process.env.AUTH_API_ENDPOINT);
  fetch(authEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      meetingNumber: meetingNumber,
      role: role
    })
  }).then((response) => {
    return response.json()
  }).then((data) => {
    console.log(data)
    startMeeting(data.signature)
  }).catch((error) => {
  	console.log(error)
  })
}



function startMeeting(signature) {
  document.getElementById('zmmtg-root').style.display = 'block'

  ZoomMtg.init({
    leaveUrl: leaveUrl,
    patchJsMedia: true,
    leaveOnPageUnload: true,
    success: (success) => {
      console.log(success)
      ZoomMtg.join({
        signature: signature,
        sdkKey: sdkKey,
        meetingNumber: meetingNumber,
        passWord: passWord,
        userName: userName,
        userEmail: userEmail,
        customerKey: "masumid",
        success: (success) => {
          console.log("success-------", success)
          createBreakoutRooms()
        },
        error: (error) => {
          console.log(error)
        },
      })
    },
    error: (error) => {
      console.log(error)
    }
  })
}

function createBreakoutRooms() {
  const roomNames = ['Room 1', 'Room 2']; // Define the names of the breakout rooms

  ZoomMtg.createBreakoutRoom({
    data: roomNames,
    success: (response) => {
      console.log("Breakout rooms created successfully", response);
      if (Array.isArray(response.rooms)) {
        response.rooms.forEach((room) => {
          breakoutRoomIds[room.name] = room.roomId; 
        });
      } else {
        console.error("Response does not contain rooms array:", response);
      }
      // openBreakoutRooms(); 
    },
    error: (error) => {
      console.error("Failed to create breakout rooms:", error);
    }
  });
}
function openBreakoutRooms() {
  ZoomMtg.openBreakoutRooms({
    success: () => {
      console.log("Breakout rooms opened successfully");
      joinBreakoutRoom(breakoutRoomIds["Room 1"]); // Join the user to Room 1
    },
    error: (error) => {
      console.error("Failed to open breakout rooms:", error);
    }
  });
}

function joinBreakoutRoom(roomId) {
  ZoomMtg.joinBreakoutRoom({
    roomId: roomId,
    success: () => {
      console.log(`Successfully joined the breakout room: ${roomId}`);
    },
    error: (error) => {
      console.error("Failed to join breakout room:", error);
    }
  });
}

function createAndJoinMeeting() {
  fetch('http://localhost:4000/create_meeting', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data => {
    console.log('Meeting created:', data);
    joinMeetingAsHost(data.signature, data.meetingNumber, data.password, data.sdkKey);
  })
  .catch(error => console.error('Error:', error));
}
