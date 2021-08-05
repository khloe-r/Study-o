console.log("script running");
// date variables
var now = new Date();
var currentMonth = now.getMonth();
var currentYear = now.getFullYear();
var monthRn = now.getMonth();
var yearRn = now.getFullYear();
let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

var twoHoursLater = new Date(now.getTime() + (2 * 1000 * 60 * 60));
twoHoursLater = twoHoursLater.toISOString();

// google api console clientID and apiKey (https://code.google.com/apis/console/#project:568391772772)
var clientId = '243003109957-8bpj74e6eib10r888ccleeh1t0lhqp8g.apps.googleusercontent.com';
var apiKey = 'AIzaSyDEL7uevoZ_rQ3JLHWDTqHGKrWvTRG-tKY';

// enter the scope of current project (this API must be turned on in the google console)
var scopes = 'https://www.googleapis.com/auth/calendar';

let eventLookup = {};


// Oauth2 functions
function handleClientLoad() {
    gapi.client.setApiKey(apiKey);
    window.setTimeout(checkAuth, 1);
    var weekdays = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
    ];
    getData();
    //genCal(currentYear, currentMonth);
}

function checkAuth() {
    gapi.auth.authorize({ client_id: clientId, scope: scopes, immediate: true }, handleAuthResult);
}

function getData() {
    gapi.client.load('calendar', 'v3', () => {
        gapi.client.calendar.events.list({
            "calendarId": "primary",
            "q": "Study-O Homework Tracker"
        }).then((response) => {
            let tempEvents = response.result.items;
            Object.values(tempEvents).forEach((e) => {
                const startTime = e.start.dateTime;
                let yr = parseInt(startTime.slice(0, 4));
                let mon = parseInt(startTime.slice(5, 7) - 1);
                let num = parseInt(startTime.slice(8, 10));
                const dateKey = yr + '-' + mon + '-' + num;
                if (eventLookup[dateKey] == null) {
                    eventLookup[dateKey] = [];
                }
                eventLookup[dateKey].push(e);
            });
            genCal(currentYear, currentMonth);
        });

    });
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
        let testing = new Date(`${document.querySelector("#dueDateInput").value}T${document.querySelector("#dueTimeInput").value}:00`);
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
                    "description": document.querySelector("#descriptionInput").value,
                    "summary": document.querySelector("#titleInput").value,
                    "location": "Study-O Homework Tracker"
                }
            });
            // getCalendarEvents();



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
                    // location.reload();
                } else {
                    console.log(errr);
                    console.log("did not work");
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


function getCalendarEvents(year, month, td, numb) {

    gapi.client.load('calendar', 'v3', () => {
        gapi.client.calendar.events.list({
            "calendarId": "primary",
            "q": "Study-O Homework Tracker"
        })
            .then(function (response) {
                let events = response.result.items;
                if (events.length > 0) {
                    for (i = 0; i < events.length; i++) {
                        var event = events[i];
                        let day = event.start.dateTime;
                        let yr = parseInt(day.slice(0, 4));
                        let mon = parseInt(day.slice(5, 7) - 1);
                        let num = parseInt(day.slice(8, 10));
                        if (mon === month && yr === year && num == numb) {

                            td.name = "test";
                            td.innerHTML += `<p>${numb}</p> <p>${event.summary}</p>`;
                            console.log(td);
                            // console.log('true');
                        }
                        else {
                            td.innerHTML = `${numb}`;
                        }

                    }
                }
            },
                function (err) { console.error("Execute error", err); });

    });
}

function genCal(year, month) {
    let startOfMonth = new Date(year, month).getDay();
    let numOfDays = 32 - new Date(year, month, 32).getDate();
    let renderMonth = document.querySelector("#month");
    let renderYear = document.querySelector("#year");
    monthRn = month;
    yearRn = year;

    renderMonth.textContent = months[`${month}`];
    renderYear.textContent = year;

    let renderNum = 1;
    let tableBody = document.querySelector("#tableBody")

    for (let i = 0; i < 6; i++) {
        let row = document.createElement('tr');
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < startOfMonth) {
                let td = document.createElement('td');
                td.classList.add('empty');
                row.append(td);
            }
            else if (renderNum > numOfDays) {
                break;
            }
            else {
                let td = document.createElement('td');
                // td.textContent = `${renderNum}`;
                //td.innerHTML = `<p>${renderNum}</p><p>test</p>`
                const dateString = `${yearRn}-${monthRn}-${renderNum}`;
                let curEvents = eventLookup[dateString];
                td.innerHTML = `<p>${renderNum}</p>`;

                if (curEvents != null && curEvents.length != 0) {
                    Object.values(curEvents).forEach((e) => {
                        td.innerHTML += `<p>${e.summary}</p>`;
                    });
                }

                row.append(td);
                renderNum++;

            }
        }
        tableBody.append(row);
    }



}
function moveRight(year, month) {
    tableBody.innerHTML = '';
    if (monthRn === 11) {
        yearRn += 1;
        year = yearRn;
        monthRn = 0;
        month = monthRn;
        genCal(year, month);
        console.log(yearRn, monthRn);
    }
    else {
        monthRn += 1;
        month = monthRn;
        year = yearRn;
        genCal(year, month);
        console.log(yearRn, monthRn);

    }
}
function moveLeft(year, month) {
    tableBody.innerHTML = '';
    if (monthRn === 0) {
        yearRn -= 1;
        year = yearRn;
        monthRn = 11;
        month = monthRn;
        genCal(year, month);
        console.log(yearRn, monthRn);

    }
    else {
        monthRn -= 1;
        month = monthRn;
        year = yearRn;
        genCal(year, month);
        console.log(yearRn, monthRn);

    }
}

// let buttonSubmit = document.querySelector("#submitButton");
// buttonSubmit.addEventListener("click", function() {
//   makeApiCall();
// // });
// var events;

// function showEventOnCalendar(response) {
//     let bod = document.querySelector("#tableBody");




// }