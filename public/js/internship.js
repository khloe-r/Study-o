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
    console.log('submitting')
    const fileNameInput = document.querySelector('#fileUploadInput')
    var file = fileInput.files[0]
    let userID = '';
    console.log('about to auth')
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            userID = user.uid;
            var storageRef = firebase.storage().ref(`${userID}/${fileNameInput.value}/${fileName.textContent}`)
            console.log('putting')
            // storageRef.put(file);
            storageRef.put(file).then((snapshot) => {
                console.log('Uploaded a blob or file!');
                location.reload();
            });
            fileNameInput.value = ''
            console.log(storageRef)
            console.log(file)
            console.log(user.uid)
        }
        
    }) 
    //window.setTimeout(location.reload() , 10);
}

const deleteFile = (parent, child) => {
    console.log("deleting file")
    let userID = ''
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            userID = user.uid;
            var storageRef = firebase.storage().ref()
            var imageRef = storageRef.child(`${userID}/${parent}/${child}`);

            // Delete the file
            imageRef.delete().then(() => {
                listFiles()
            }).catch((error) => {
                console.log('OOps')
            });
        }
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
                            fileList.innerHTML += `<div class="box">
                                                    <div class="columns">
                                                    <div class="column is-11">
                                                    <p class="subtitle is-clickable" onclick="downloadFile('${itemRef.parent.name}', '${itemRef.name}')">           
                                                     ${itemRef.name}
                                                    </p>
                                                    </div>
                                                    <div class="column">
                                                    <button class="delete column" onclick="deleteFile('${itemRef.parent.name}', '${itemRef.name}')"></button>
                                                    </div>
                                                    </div>
                                                    </div>`

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

