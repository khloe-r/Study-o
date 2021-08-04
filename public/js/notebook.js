/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
    var pre = document.getElementById('content');
    var textContent = document.createTextNode(message + '\n');
    console.log(textContent);
}

/**
 * Prints the title of a sample doc:
 * https://docs.google.com/document/d/195j9eDD3ccgjQRttHhJPymLJUCOUjs-jmwTrekvdjFE/edit
 */
function printDocTitle() {
    gapi.client.docs.documents.get({
    documentId: '195j9eDD3ccgjQRttHhJPymLJUCOUjs-jmwTrekvdjFE'
    }).then(function(response) {
    var doc = response.result;
    var title = doc.title;
    appendPre('Document "' + title + '" successfully found.\n');
    }, function(response) {
    appendPre('Error: ' + response.result.error.message);
    });
}

const createDoc = (title, content) => {
    gapi.client.docs.documents.create({
        "title": title
    })
    .then((response) => {        
        const doc = response.result;
        const docId = doc.documentId;

        // TODO: Need to store document ID in database (under user key) to know which documents we can view

        gapi.client.docs.documents.batchUpdate({
            documentId: docId,
            requests: [{
                insertText: {
                    text: content,
                    location: {
                        index: 1,
                    },
                },
            }],
        })
        .then((response) => {
            console.log(response.result);
        })
    });  
}

const handleNoteSubmit = () => {
    const noteTitle = document.querySelector('#noteTitle');
    const noteText = document.querySelector('#noteText');
}

const createNote = (title, text) => {
    return `
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
}