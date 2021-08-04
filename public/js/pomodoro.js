console.log("running")

const minute = document.querySelector('#minute')
const second = document.querySelector("#second");
const studySession = document.querySelector("#studySession");
const progressBar = document.querySelector('#progressBar')

const trigger = document.querySelector("#trigger");
let i = 0
let countdown = 25;

// function sound(src) {
//   this.sound = document.createElement("audio");
//   this.sound.src = src;
//   this.sound.setAttribute("preload", "auto");
//   this.sound.setAttribute("controls", "none");
//   this.sound.style.display = "none";
//   document.body.appendChild(this.sound);
//   this.play = function(){
//     this.sound.play();
//   }
//   this.stop = function(){
//     this.sound.pause();
//   }
// }

// const alertSound;
// const musicRef = firebase.storage().ref(`mixkit-alarm-tone-996.wav`)
// musicRef.getDownloadURL()
// .then((url) => {
//     alertSound = sound(url)
// })

studySession.onchange = () => {
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
    //   alertSound.play()
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