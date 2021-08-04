let docIdList = []

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
    document.querySelector("#container").innerHTML += card;
}

const createDoc = (title, text) => {
    gapi.client.docs.documents.create({
        title: title
    })
    .then((response) => {        
        const doc = response.result;
        const docId = doc.documentId;
        docIdList.push(docId);

        // TODO: Need to store document ID in database (under user key) to know which documents we can view

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
        });
    });  
}

const readDoc = (docId) => {
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

        createNote(title, text);
    });
}

const handleNoteSubmit = () => {
    const noteTitle = document.querySelector('#noteTitle');
    const noteText = document.querySelector('#noteText');

    createDoc(noteTitle.value, noteText.value);
    noteTitle.value = "";
    noteText.value = "";
}
