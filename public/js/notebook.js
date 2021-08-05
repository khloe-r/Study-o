let googleUserId, editedNoteId, editedDocId;

window.onload = () => {
// When page loads, check user logged in state
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {            
            googleUserId = user.uid;
            console.log(`Google User ID: ${googleUserId}`);
            displayAllDocs();
        } else {
            // If not logged in redirect to log in page
            window.location = 'index.html';
        }
    }); 
}

const createNote = (noteId, docId, title, text) => {
    const card = 
    `
    <div class="column is-one-third">
        <div class="card">
            <header class="card-header">
                <p class="card-header-title">${title}</p>
            </header>
            <div class="card-content">
                <div class="content">${text}</div>
            </div>
            <footer class="card-footer">
                <a href="#" class="button is-light"
                    onclick="editDoc('${noteId}', '${docId}')">
                    Edit
                </a>
            </footer>
        </div>        
    </div>
    `
    return card;
}

const createDoc = (title, text) => {
    gapi.client.docs.documents.create({
        title: title
    })
    .then((response) => {        
        const doc = response.result;
        const docId = doc.documentId;
        const time = Date.now();

        firebase.database().ref(`users/${googleUserId}`).push({
            documentId: docId,
            timestamp: time
        })
        .then(() => {
            console.log("Pushed to database");
        });

        gapi.client.docs.documents.batchUpdate({
            documentId: docId,
            requests: [{
                insertText: {
                    text: text,
                    location: {
                        index: 1,
                    },
                },
            }],
        })
        .then((response) => {
            console.log(response.result);
            displayAllDocs();
        });
    });  
}

const addNote = () => {
    const noteTitle = document.querySelector('#noteTitle');
    const noteText = document.querySelector('#noteText');

    createDoc(noteTitle.value, noteText.value);
    noteTitle.value = "";
    noteText.value = "";
}

const displayDoc = (noteId, docId) => {
    gapi.client.docs.documents.get({
        documentId: docId
    })
    .then((response) => {
        const doc = response.result;
        const title = doc.title;
        const content = doc.body.content;
        
        let text = "";
        for (const contentObject of content) {
            if ("paragraph" in contentObject) {
                const elements = contentObject.paragraph.elements;
                for (const element of elements) {
                    if ("textRun" in element) {
                        text += element.textRun.content;
                    }
                }
            }
        }

        const card = createNote(noteId, docId, title, text);
        document.querySelector("#container").innerHTML += card;
    });
}

const displayAllDocs = () => {
    let count = 0;
    document.querySelector("#container").innerHTML = "";

    const notesRef = firebase.database().ref(`users/${googleUserId}`);
    notesRef.on('value', (snapshot) => {
        const data = snapshot.val();
        if (count < Object.keys(data).length) {            
            for (const noteId in data) {
                const docId = data[noteId].documentId;
                displayDoc(noteId, docId);
                count++;
            }
        }
    });
}

const editDoc = (noteId, docId) => {
    gapi.client.docs.documents.get({
        documentId: docId
    })
    .then((response) => {
        const doc = response.result;
        const title = doc.title;
        const content = doc.body.content;
        
        let text = "";
        for (const contentObject of content) {
            if ("paragraph" in contentObject) {
                const elements = contentObject.paragraph.elements;
                for (const element of elements) {
                    if ("textRun" in element) {
                        text += element.textRun.content;
                    }
                }
            }
        }

        editedNoteId = noteId;
        editedDocId = docId;
        // document.querySelector("#editTitleInput").value = title;
        document.querySelector("#editContentInput").value = text;
        document.querySelector("#editNoteModal").classList.add('is-active');        
    });
}

const closeEditModal = () => {
    document.querySelector("#editNoteModal").classList.toggle('is-active');
}

const saveEditedNote = () => {
    // const newTitle = document.querySelector("#editTitleInput").value;
    const newContent = document.querySelector("#editContentInput").value;

    gapi.client.docs.documents.batchUpdate({
        documentId: editedDocId,
        requests: [{
            insertText: {
                text: newContent,
                location: {
                    index: 1,
                },
            },
        }],
    })
    .then((response) => {
        console.log(response.result);
        firebase.database().ref(`users/${googleUserId}/${editedNoteId}`)
        .update({
            documentId: editedDocId,
            timestamp: Date.now()
        });        
    });
    
    displayAllDocs();
    closeEditModal();
}
