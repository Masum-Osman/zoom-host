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