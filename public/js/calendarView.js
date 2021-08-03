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


// Oauth2 functions
function handleClientLoad() {
    gapi.client.setApiKey(apiKey);
    window.setTimeout(checkAuth, 1);
}

function checkAuth() {
    gapi.auth.authorize({ client_id: clientId, scope: scopes, immediate: true }, handleAuthResult);
}

// show/hide the 'authorize' button, depending on application state
function handleAuthResult(authResult) {
    var authorizeButton = document.getElementById('authorize-button');
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
function makeApiCall() {
    if (document.querySelector("#dueDateInput").value.length !== 0 && document.querySelector("#titleInput").value.length !== 0 && document.querySelector("#dueTimeInput").value.length !== 0) {
        gapi.client.load('calendar', 'v3', function () {
            var dateWTime = ``					// load the calendar api (version 3)
            var request = gapi.client.calendar.events.insert({
                'calendarId': 'primary',	// calendar ID
                "resource": {
                    "end": {
                        "date": "2021-08-04"
                    },
                    "start": {
                        "date": "2021-08-03"
                    },
                    "description": document.querySelector("#descriptionInput").value,
                    "summary":document.querySelector("#titleInput").value
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
// let buttonSubmit = document.querySelector("#submitButton");
// buttonSubmit.addEventListener("click", function() {
//   makeApiCall();
// });

