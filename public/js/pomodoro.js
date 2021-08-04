console.log("running")

const minute = document.querySelector('#minute')
const second = document.querySelector("#second");
const studySession = document.querySelector("#studySession");
const progressBar = document.querySelector('#progressBar')
const alertSound = document.createElement("audio");

const trigger = document.querySelector("#trigger");
let i = 0
let countdown = 25;
let counter = 0; 

window.onload = () => {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            const musicRef = firebase.storage().ref(`mixkit-alarm-tone-996.wav`)
            musicRef.getDownloadURL()
                .then((url) => {
                    alertSound.src = url
                    alertSound.style.display = "none";
                    document.body.appendChild(alertSound);
                    alertSound.setAttribute("preload", "auto");
                    alertSound.setAttribute("controls", "none");
                })

        }
    })
}

studySession.onchange = () => {
    resetBar()
}

const resetBar = () => {
    if (studySession.value === 'Study (25 minutes)') {
        countdown = 25
        progressBar.max = 25 * 60
    } else if (studySession.value === 'Short Break (5 minutes)') {
        countdown = 5
        progressBar.max = 5 * 60
    } else {
        countdown = 15
        progressBar.max = 15 * 60
    }
    reset()
}

const start = () => {
  if (trigger.innerHTML === "Start") {
    i = setInterval(decreaseTime, 1000)
    trigger.innerHTML = "Pause"
  }
  else {
    clearInterval(i)
    trigger.innerHTML = "Start"
  }
} 

const decreaseTime = () => {
  var s = parseInt(second.innerHTML) - 1
  progressBar.value += 1
  if (s !== -1) {
    if (s <= 9) {
      second.innerHTML = "0" + s
    }
    else {
      second.innerHTML = s
    }
  }
  else {
    var m = parseInt(minute.innerHTML) - 1
    if (m !== -1) {
      second.innerHTML = "59"
      minute.innerHTML = parseInt(minute.innerHTML) - 1
      
    }
    else {
        second.innerHTML = "00"
        clearInterval(i)
          alertSound.play()
        if (countdown === 25) {
            counter += 1
            if (counter === 3) {
                countdown = 15
                studySession.value = 'Long Break (15 minutes)'
            } else {
                countdown = 5
                studySession.value = 'Short Break (5 minutes)'
            }
            resetBar()
            reset()
        } else {
            countdown = 25
            studySession.value = 'Study (25 minutes)'
            resetBar()
            reset()
        }
    }
  }
}

const reset = () => {
    minute.innerHTML = countdown
    second.innerHTML = "00"
    clearInterval(i)
    trigger.innerHTML = "Start"
    progressBar.value = 0
}