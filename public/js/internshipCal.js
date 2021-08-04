// Add Calender Event
console.log("script running");
// date variables
var now = new Date();
today = now.toISOString(); 

var twoHoursLater = new Date(now.getTime() + (2 * 1000 * 60 * 60));
twoHoursLater = twoHoursLater.toISOString();

// google api console clientID and apiKey (https://code.google.com/apis/console/#project:568391772772)
var clientId = '243003109957-8bpj74e6eib10r888ccleeh1t0lhqp8g.apps.googleusercontent.com';
var apiKey = 'AIzaSyDEL7uevoZ_rQ3JLHWDTqHGKrWvTRG-tKY';
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');
var pre = document.getElementById('listView');
console.log(authorizeButton)

// enter the scope of current project (this API must be turned on in the google console)
var scopes = 'https://www.googleapis.com/auth/calendar';


function initClient() {
    console.log("EHHLO")
    gapi.client.init({
        apiKey: apiKey,
        clientId: clientId,
        discoveryDocs: DISCOVERY_DOCS,
        scope: scopes
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
    gapi.client.setApiKey(apiKey);
}

// Oauth2 functions
function handleClientLoad() {
    gapi.load('client:auth2', initClient);
    // setTimeout(gapi.client.setApiKey(apiKey), 10000);
    window.setTimeout(checkAuth, 1);
}

function checkAuth() {
    gapi.auth.authorize({ client_id: clientId, scope: scopes, immediate: true }, handleAuthResult);
}

// show/hide the 'authorize' button, depending on application state
console.log("script running");
// date variables
var now = new Date();
today = now.toISOString();

var twoHoursLater = new Date(now.getTime() + (2 * 1000 * 60 * 60));
twoHoursLater = twoHoursLater.toISOString();

// google api console clientID and apiKey (https://code.google.com/apis/console/#project:568391772772)
var clientId = '243003109957-8bpj74e6eib10r888ccleeh1t0lhqp8g.apps.googleusercontent.com';
var apiKey = 'AIzaSyDEL7uevoZ_rQ3JLHWDTqHGKrWvTRG-tKY';

// enter the scope of current project (this API must be turned on in the google console)
var scopes = 'https://www.googleapis.com/auth/calendar';


// function checkAuth() {
//     gapi.auth.authorize({ client_id: clientId, scope: scopes, immediate: true }, handleAuthResult);
// }

// show/hide the 'authorize' button, depending on application state
function handleAuthResult(authResult) {
    var resultPanel = document.getElementById('result-panel');
    var resultTitle = document.getElementById('result-title');
    console.log(authResult);

    if (authResult.error) {
        location.replace("https://study-o.web.app/gCal.html");

        //makeApiCall();	
    } //else {													// otherwise, show button
    // authorizeButton.style.visibility = 'visible';
    // resultPanel.className += ' panel-danger';				// make panel red
    // authorizeButton.onclick = handleAuthClick;				// setup function to handle button click
    //}
}


//function triggered when user authorizes app
function handleAuthClick(event) {
    gapi.auth.authorize({ client_id: clientId, scope: scopes, immediate: false }, handleAuthResult);
    return false;
}

// setup event details

// var resource = {

//     "summary": "Sample Event " + Math.floor((Math.random() * 10) + 1),
//     "start": {
//         "dateTime": today
//     },
//     "end": {
//         "dateTime": twoHoursLater
//     },
//     "description": "test"
// };

// function load the calendar api and make the api call
function addApplication() {
    console.log("DHFDJ")
    const title = document.querySelector('#titleInput')
    const description = document.querySelector('#descriptionInput')
    const deadline = document.querySelector('#deadlineInput')
    const deadtime = document.querySelector('#dueTimeInput')
    const status = document.querySelector('#statusInput')
    let colourID = 0
    let tagColour = ''
    if (status.value === 'Have to Apply') {
        colourID = 4
        tagColour = 'is-danger'
    } else if (status.value === 'Applied & Waiting') {
        colourID = 5
        tagColour = 'is-warning'
    } else {
        colourID = 2
        tagColour = 'is-success'
    }
    if (title.value !== '' && description.value !== '' && deadline.value !== '') {  
        let testing = new Date(`${document.querySelector("#deadlineInput").value}T${ document.querySelector("#dueTimeInput").value}:00`);
        gapi.client.load('calendar', 'v3', function () {
            var dateWTime = testing.toISOString();					// load the calendar api (version 3)
            var request = gapi.client.calendar.events.insert({
                'calendarId': 'primary',	// calendar ID
                "resource": {
                    "end": {
                        "dateTime": dateWTime
                    },
                    "start": {
                        "dateTime": dateWTime
                    },
                    "description": document.querySelector("#descriptionInput").value + ` <br/> <span class="tag ${tagColour}">${status.value}</span>`,
                    "summary":document.querySelector("#titleInput").value,
                    "colorId": colourID,
                    "location": 'Study-O Internship Tracker',
                    
                }
            });

            gapi.client.calendar.events.list({
                "calendarId": "primary"
            })
                .then(function (response) {
                    // Handle the results here (response.result has the parsed body).
                    console.log("Response", response);
                },
                    function (err) { console.error("Execute error", err); });

            // handle the response from our api call
            request.execute(function (resp, errr) {
                if (resp.status == 'confirmed') {
                    //document.getElementById('event-response').innerHTML = "Event created successfully. View it <a href='" + resp.htmlLink + "'>online here</a>.";
                    console.log("successfully submitted!");
                    title.value = ""
                    description.value = ""
                    pre.innerHTML = ""
                    listUpcomingEvents()
                    alert("it submitted!");
                } else {
                    console.log(errr);
                    //document.getElementById('event-response').innerHTML = "There was a problem. Reload page and try again.";
                    // calendarList.get('primary')
                }


                console.log(resp);
            });
        });

    }
    else {
        alert("Fill in all fields");
    }

}

function appendPre(message) {
    pre = document.getElementById('listView');
    var textContent = document.createElement("DIV");
    textContent.innerHTML = message;
    textContent.classList.add("is-half", "column")
    pre.appendChild(textContent);
}

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

function listUpcomingEvents() {
    gapi.client.calendar.events.list({
        'calendarId': 'primary',
        'timeMin': (new Date()).toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 10,
        'orderBy': 'startTime',
        'q': 'Study-O Internship Tracker'
    }).then(function(response) {
        var events = response.result.items;
    //   appendPre('Upcoming events:');

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
            let myDate = event.start.dateTime.toString()
            let time = new Date(myDate).toLocaleTimeString('en',{ timeStyle: 'short', hour12: false, timeZone: 'UTC' });
            const suffix = (parseInt(time.substring(0, 2)) >= 12 ? 'PM' : 'AM')
            time = (parseInt(time.substring(0, 2)) > 12 ? parseInt(time.substring(0, 2)) - 12 : time.substring(0, 2)) + time.substring(2, 5)
            const theDate = months[parseInt(myDate.substring(5, 7)) - 1] + ' ' + myDate.substring(8, 10) + ', ' + myDate.substring(0, 4)
            appendPre(`<div class="box my-2 pr-3 pl-3">
                        <h2 class="has-text-weight-semibold">${event.summary}</h2>
                        <p>Due on ${theDate} at ${time} ${suffix}</p>
                        <p>${event.description}</p>
                    </div>`)
        }
        } else {
        appendPre('No upcoming events found.');
        }
    });
}