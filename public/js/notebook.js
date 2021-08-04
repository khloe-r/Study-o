let googleUserId;

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

const createNote = (title, text) => {
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

        firebase.database().ref(`users/${googleUserId}`).push({
            documentId: docId
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
            displayDoc(docId);
        });
    });  
}

const displayDoc = (docId) => {
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

        const card = createNote(title, text);
        document.querySelector("#container").innerHTML += card;
    });
}

const displayAllDocs = () => {
    const notesRef = firebase.database().ref(`users/${googleUserId}`);
    notesRef.on('value', (snapshot) => {
        const data = snapshot.val();
        for (const noteId in data) {
            const docId = data[noteId].documentId;
            displayDoc(docId);
        }
    });
}

const handleNoteSubmit = () => {
    const noteTitle = document.querySelector('#noteTitle');
    const noteText = document.querySelector('#noteText');

    createDoc(noteTitle.value, noteText.value);
    noteTitle.value = "";
    noteText.value = "";
}
