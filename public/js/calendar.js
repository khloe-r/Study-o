// Client ID and API key from the Developer Console
var CLIENT_ID = '243003109957-8bpj74e6eib10r888ccleeh1t0lhqp8g.apps.googleusercontent.com';
var API_KEY = 'AIzaSyDEL7uevoZ_rQ3JLHWDTqHGKrWvTRG-tKY';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/calendar";

var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(function() {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
    }, function(error) {
        appendPre(JSON.stringify(error, null, 2));
    });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';
        listUpcomingEvents();
    } else {
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
    }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 */
const displayEvent = (eventID, title, date, description) => {
    let card = 
    `<div class="column is-one-quarter">
        <div class="card">
            <header class="card-header">
                <div>
                    <p class="card-header-title">${title}</p>
                    <p class="card-header-title">${date}</p>
                </div>
            </header>
            <div class="card-content">
                <div class="content">${description}</div>
            </div>
            <button id="${eventID}" class="button is-info" onclick="editEvent(this.id)">Edit Event</button>
        </div>        
    </div>`;
   
    document.querySelector('#content').innerHTML += card;
}

const editEvent = (eventID) => {
    const editEventModal = document.querySelector('#editEventModal');
    editEventModal.classList.value = `modal ${eventID}`;
    console.log(editEventModal.classList);
    editEventModal.classList.toggle('is-active');
}

const saveEditedNote = () => {    
    const noteTitle = document.querySelector('#editTitleInput').value;
    const noteText = document.querySelector('#editTextInput').value;
    const editEventModal = document.querySelector('#editEventModal');
    const eventID = editEventModal.classList[editEventModal.classList.length - 2];

    const event = gapi.client.calendar.events.get({"calendarId": 'primary', "eventId": eventID});
    event.summary = noteTitle;
    event.description = noteText;

    let request = gapi.client.calendar.events.patch({
        'calendarId': 'primary',
        'eventId': eventID,
        'resource': event
    });

    request.execute(function (event) {
        console.log(event);
    });

    closeEditModal();
}

const closeEditModal = () => {
    const editEventModal = document.querySelector('#editEventModal');
    editEventModal.classList.toggle('is-active');
};

/**
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */
function listUpcomingEvents() {
    gapi.client.calendar.events.list({
        'calendarId': 'primary',
        'timeMin': (new Date()).toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        // 'maxResults': 10,
        'orderBy': 'startTime'
    }).then(function(response) {
        var events = response.result.items;

        if (events.length > 0) {
            for (i = 0; i < events.length; i++) {
                var event = events[i];
                var when = event.start.dateTime;
                if (!when) {
                    when = event.start.date;
                }

                let date = new Date(when);
                displayEvent(event.id, event.summary, date.toUTCString(), event.description);
            }
        }
    });
}

