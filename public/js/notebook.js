let googleUserId, editedNoteId, editedDocId, oldContent;

window.onload = () => {
// When page loads, check user logged in state
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {            
            googleUserId = user.uid;
            console.log(`Google User ID: ${googleUserId}`);
            initialSetup();            
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
            timestamp: time,
            textContent: text,
            percentChange: 100
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
        oldContent = text;
        // document.querySelector("#editTitleInput").value = title;
        document.querySelector("#editContentInput").value = text;
        document.querySelector("#editNoteModal").classList.add('is-active');        
    });
}

const closeEditModal = () => {
    document.querySelector("#editNoteModal").classList.toggle('is-active');
}

function editDistance(longer, shorter) {
    longer = longer.toLowerCase();
    shorter = shorter.toLowerCase();

    let costs = new Array(shorter.length + 1);
    for (let i = 0; i <= longer.length; i++) {
        let lastValue = i;
        for (let j = 0; j <= shorter.length; j++) {
            if (i == 0)
                costs[j] = j;
            else {
                if (j > 0) {
                    let newValue = costs[j - 1];
                    if (longer.charAt(i - 1) != shorter.charAt(j - 1))
                        newValue = Math.min(Math.min(newValue, lastValue),
                            costs[j]) + 1;
                    costs[j - 1] = lastValue;
                    lastValue = newValue;
                }
            }
        }
        if (i > 0)
            costs[shorter.length] = lastValue;
    }
    return costs[shorter.length];
}

const calculatePercentChange = (oldContent, newContent) => {
    let longer = oldContent;
    let shorter = newContent;
    if (oldContent.length < newContent.length) {
        longer = newContent;
        shorter = oldContent;
    }

    let longerLength = longer.length;
    if (longerLength === 0) {
        return 1.0;
    }

    return 1.0 - ((longerLength - editDistance(longer, shorter)) / parseFloat(longerLength));
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
            timestamp: Date.now(),
            textContent: newContent,
            percentChange: Math.round(calculatePercentChange(oldContent, newContent)*10000)/100
        });        
    });
    
    displayAllDocs();
    closeEditModal();
}

const displayRecentlyEdited = (docId, timestamp, percentChange) => {
    const container = document.querySelector("#recent");
    container.innerHTML = "";

    gapi.client.docs.documents.get({
        documentId: docId
    })
    .then((response) => {
        const doc = response.result;
        const title = doc.title;
        const date = new Date(timestamp);
        const card = 
        `
        <div class="column is-half">
            <div class="box my-2 pr-3 pl-3">
                <h2 class="has-text-weight-semibold"><a href="https://docs.google.com/document/d/${docId}/edit">${title}</a></h2>
                <p>${date.toUTCString()}</p>
                <p>Percent Change: ${percentChange}</p>
            </div>       
        </div>
        `

        container.innerHTML += card;
    });
}

const findRecentlyEdited = () => {
    let itemList = [];

    const notesRef = firebase.database().ref(`users/${googleUserId}`);
    notesRef.on('value', (snapshot) => {
        const data = snapshot.val();          
        for (const noteId in data) {
            itemList.push(data[noteId]);
        }

        itemList.sort((x, y) => {
            return y.timestamp - x.timestamp;
        });

        for (let i = 0; i < 4; i++) {
            displayRecentlyEdited(itemList[i].documentId, itemList[i].timestamp, itemList[i].percentChange);
        }
    });
}

const initialSetup = () => {
    findRecentlyEdited();
    displayAllDocs();
}
