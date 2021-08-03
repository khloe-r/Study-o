const fileInput = document.querySelector('#fileUpload')
const fileName = document.querySelector('#fileUploadName');
console.log(fileInput)
fileInput.onchange = () => {
    if (fileInput.files.length > 0) {
    fileName.textContent = fileInput.files[0].name;
    }
}

const submitFile = () => {
    const fileNameInput = document.querySelector('#fileUploadInput')
    console.log(`${fileName.textContent} is being submitted`)
    var file = fileInput.files[0]
    var storageRef = firebase.storage().ref('images/' + fileName.textContent)
    storageRef.put(file)
}