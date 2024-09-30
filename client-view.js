ZoomMtg.preLoadWasm()
ZoomMtg.prepareWebSDK()

var authEndpoint = 'http://localhost:4000/zoom_auth_jwt'
var sdkKey = '4EvPaJwQTl6lpYmcAeqFg'
var meetingNumber = '93362050842'
// var meetingNumber = '97057314707'
var passWord = '123456'
var role = 1
var userName = 'Host'
var userEmail = 'masum@gmail.com'
var registrantToken = ''
var zakToken = 'aDFImFLu0idYeKfnun-TSKg517Sg0Ff8g'
var leaveUrl = 'http://127.0.0.1:5501/'

function getSignature() {
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
          createAndOpenBreakoutRooms()
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

function createAndOpenBreakoutRooms() {
  const roomNames = ["room_1", "room_2", "room_3", "room_4"];

  ZoomMtg.createBreakoutRoom({
    data: roomNames,
    success: (response) => {
      console.log("Breakout rooms created successfully", response);
      openBreakoutRooms();
    },
    error: (error) => {
      console.error("Failed to create breakout rooms:", error);
    }
  });
}


function openBreakoutRooms() {
  ZoomMtg.openBreakoutRooms({
    success: (openBreakoutRooms) => {
      console.log("Breakout Room IDs:", ); 
      console.log("Breakout rooms opened successfully: ", openBreakoutRooms);
      getBreakOutRooms()
    },
    error: (error) => {
      console.error("Failed to open breakout rooms:", error);
    }
  });
}

function getBreakOutRooms() {
  ZoomMtg.getBreakoutRooms({
    success: (rooms) => {
      console.log("Breakout Rooms from ZoomMtg.getBreakoutRooms(): ", rooms);
      // if (Array.isArray(rooms) && rooms.length > 0) {
      //   rooms.forEach(room => {
      //     console.log(`Room ID: ${room.roomId}, Room Name: ${room.name}`);
      //   });
      // } else {
      //   console.log("No breakout rooms found.");
      // }
      
    },
    error: (error) => {
      console.error("Failed to get breakout rooms:", error);
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
