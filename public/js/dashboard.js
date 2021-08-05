console.log("script running");

window.onload = () => { 
// When page loads, check user logged in state
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            console.log("LoggedIn")
            let googleUserId = user.uid;
            let googleUser = user;
            displayPage(user.displayName);
        } else {
            // If not logged in redirect to log in page
            window.location = 'index.html';
        }
    }); 
}

function displayPage(name) {
    const welcomeTitle = document.querySelector('#welcomeTitle')
    welcomeTitle.innerHTML = `Welcome ${name}!`
}

// Client ID and API key from the Developer Console
var CLIENT_ID = '243003109957-8bpj74e6eib10r888ccleeh1t0lhqp8g.apps.googleusercontent.com';
var API_KEY = 'AIzaSyDEL7uevoZ_rQ3JLHWDTqHGKrWvTRG-tKY';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');
var pre = document.querySelector('#listView');

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
}).then(function () {
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
    signoutButton.style.display = 'none';
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
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
    var textContent = document.createElement("DIV");
    textContent.innerHTML = message;
    textContent.classList.add("is-one-fifth", "column")
    pre.appendChild(textContent);
}

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
    'maxResults': 10,
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
        console.log(event)
        const months = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ];
        console.log(event)
        let myDate = (event.start.date ? event.start.date : event.start.dateTime)
        const theDate = months[parseInt(myDate.substring(5, 7)) - 1] + ' ' + myDate.substring(8, 10) + ', ' + myDate.substring(0, 4)
        let desc = (event.description ? event.description.substring(0, 75) : "")
        if (event.description) {
            if (event.description.length > 75) {
                desc += "..."
            }
        }
        appendPre(`<div class="box" style="height:400px">
                        <h2 class="has-text-weight-semibold is-size-3">${event.summary}</h2>
                        <p>Happening on ${theDate}</p>
                        <p>${desc}</p>
                    </div>`)
    }
    } else {
    appendPre('No upcoming events found.');
    }
});
}

