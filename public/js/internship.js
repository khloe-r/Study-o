// Cloud Storage
console.log("script run")

const fileInput = document.querySelector('#fileUpload')
const fileName = document.querySelector('#fileUploadName');
const fileList = document.querySelector('#fileList')
fileInput.onchange = () => {
    if (fileInput.files.length > 0) {
    fileName.textContent = fileInput.files[0].name;
    } 
}

window.onload = () => {
    listFiles()    
}

const submitFile = () => {
    const fileNameInput = document.querySelector('#fileUploadInput')
    var file = fileInput.files[0]
    let userID = '';
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            userID = user.uid;
            var storageRef = firebase.storage().ref(`${userID}/${fileNameInput.value}/${fileName.textContent}`)
            storageRef.put(file)
            fileNameInput.value = ''
        }
        location.reload()
    }) 
    
}

const listFiles = () => {
    let userID = ''
    fileList.innerHTML = ''
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            userID = user.uid;
            // Create a reference under which you want to list
            var storageRef = firebase.storage().ref()
            var listRef = storageRef.child(`${userID}/`);
            const hierarchy = {}

            // Find all the prefixes and items.
            listRef.list()
            .then((res) => {
                res.prefixes.forEach((folderRef) => {
                   
                    folderRef.list()
                    .then((resRef) => {
                        resRef.items.forEach((itemRef, index) => {
                            if (index === 0) {
                                fileList.innerHTML += `<h1 class="title mt-4">${itemRef.parent.name}</h1>`
                            }
                            fileList.innerHTML += `<p class="subtitle is-clickable" onclick="downloadFile('${itemRef.parent.name}', '${itemRef.name}')">${itemRef.name}</p>`

                        })
                    })
                });
            }).catch((error) => {
                console.log("ERROR")
            });
        }
    }) 
}

const downloadFile = (parent, child) => {
    let userID = ''
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            userID = user.uid;
            var storageRef = firebase.storage().ref()
            storageRef.child(`${userID}/${parent}/${child}`).getDownloadURL()
            .then((url) => {
                // // This can be downloaded directly:
                // var xhr = new XMLHttpRequest();
                // xhr.responseType = 'blob';
                // xhr.onload = (event) => {
                //     var blob = xhr.response;
                // };
                // xhr.open('GET', url);
                // xhr.send();

                // Or inserted into an <img> element
                var myDownload = document.getElementById('myDownload');
                var fileSelected = document.querySelector('#fileSelected')
                fileSelected.innerHTML = `File Selected: ${child}`
                myDownload.setAttribute('href', url);
                myDownload.setAttribute('download', child);
            })
            .catch((error) => {
                console.log(error)
            });
        }
    })
}