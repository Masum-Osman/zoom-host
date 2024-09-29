ZoomMtg.preLoadWasm()
ZoomMtg.prepareWebSDK()

var authEndpoint = 'http://localhost:4000/zoom_auth_jwt'
var sdkKey = '4EvPaJwQTl6lpYmcAeqFg'
var meetingNumber = '93362050842'
var passWord = '123456'
var role = 0
var userName = '65b0d02d60023489a81394db'
var userEmail = 'masum@gmail.com'
var registrantToken = ''
var zakToken = 'aDFImFLu0idYeKfnun-TSKg517Sg0Ff8g'
var leaveUrl = 'http://127.0.0.1:5500/'

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

/*
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
        tk: registrantToken,
        zak: zakToken,
        customerKey: "masumid",
        success: (success) => {
          console.log("success-------", success)
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

*/

// ... (previous Zoom setup code remains the same)

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
        tk: registrantToken,
        zak: zakToken,
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
  const numberOfRooms = 5;
  const roomNames = Array.from({length: numberOfRooms}, (_, i) => `Room ${i + 1}`);
  const durationInMinutes = 15; // Set the duration for breakout rooms

  ZoomMtg.getBreakoutRooms({
    success: (rooms) => {
      if (rooms.length === 0) {
        // Create breakout rooms
        ZoomMtg.createBreakoutRooms({
          rooms: roomNames.map(name => ({ name })),
          options: {
            allow_participants_choose_room: false,
            allow_participants_return_main: true,
            auto_close_time: durationInMinutes * 60, // Convert minutes to seconds
            timer_duration: durationInMinutes * 60
          },
          success: () => {
            console.log("Breakout rooms created successfully");
            assignParticipantsToRooms();
          },
          error: (error) => {
            console.error("Failed to create breakout rooms:", error);
          }
        });
      } else {
        console.log("Breakout rooms already exist");
        assignParticipantsToRooms();
      }
    },
    error: (error) => {
      console.error("Failed to get breakout rooms:", error);
    }
  });
}

function assignParticipantsToRooms() {
  ZoomMtg.listParticipants({
    success: (participants) => {
      const assignments = {};
      participants.forEach((participant, index) => {
        const roomIndex = index % 5; // Distribute participants evenly across 5 rooms
        if (!assignments[roomIndex]) {
          assignments[roomIndex] = [];
        }
        assignments[roomIndex].push(participant.userId);
      });

      ZoomMtg.assignParticipantsToBreakoutRooms({
        assignments: assignments,
        success: () => {
          console.log("Participants assigned to breakout rooms");
          openBreakoutRooms();
        },
        error: (error) => {
          console.error("Failed to assign participants:", error);
        }
      });
    },
    error: (error) => {
      console.error("Failed to list participants:", error);
    }
  });
}

function openBreakoutRooms() {
  ZoomMtg.openBreakoutRooms({
    success: () => {
      console.log("Breakout rooms opened successfully");
    },
    error: (error) => {
      console.error("Failed to open breakout rooms:", error);
    }
  });
}