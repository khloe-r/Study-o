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
    // var weekdays = [
    //     'Sunday',
    //     'Monday',
    //     'Tuesday',
    //     'Wednesday',
    //     'Thursday',
    //     'Friday',
    //     'Saturday'
    // ];

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
    getData();
}


//function triggered when user authorizes app
function handleAuthClick(event) {
    gapi.auth.authorize({ client_id: clientId, scope: scopes, immediate: false }, handleAuthResult);
    return false;
}


// function load the calendar api and make the api call
function makeApiCall() {

    if (document.querySelector("#dueDateInput").value.length !== 0 && document.querySelector("#titleInput").value.length !== 0 && document.querySelector("#dueTimeInput").value.length !== 0) {
        let testing = new Date(`${document.querySelector("#dueDateInput").value}T${document.querySelector("#dueTimeInput").value}:00`);
        gapi.client.load('calendar', 'v3', function () {
            let tagColour = '';
            let colourId = 0;
            let status = document.querySelector("#lengthInput");
            if (status.value === 'More than an hour') {
            tagColour = 'is-danger'
            colourID = 4
            } else if (status.value === '30 minutes to an hour') {
                tagColour = 'is-warning'
                colourID = 5
            } else {
                tagColour = 'is-success'
                colourID = 2
            }
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
                    "location": "Study-O Homework Tracker",
                    "showDeleted": false,
                    "colorId": colourID
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
                    // alert("it submitted!");
                    location.reload();
                } else {
                    console.log(errr);
                    console.log("did not work, try refreshing your page");
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
                td.innerHTML = `<p class ="title">${renderNum}</p>`;

                if (curEvents != null && curEvents.length != 0) {
                    Object.values(curEvents).forEach((e) => {
                        td.innerHTML += `<div class="columns">
                                                <div class="column is-11">
                                                    <span class="tag is-clickable is-medium ${tagCol(e.colorId)}" onclick ="toggleModal('${e.id}')"> ${e.summary} 
                                                    </span>
                                                    <div class="modal" id = '${e.id}'>
                                                        <div class="modal-background"></div>
                                                            <div class="modal-card">
                                                                <header class="modal-card-head">
                                                                    <p class="modal-card-title">${e.summary}</p>

                                                                    <button class="delete" onclick = "toggleModal('${e.id}')" aria-label="close"></button>
                                                                </header>
                                                            <section class="modal-card-body">
                                                                <p>This is due at: ${e.start.dateTime.slice(11,16)}!</p>
                                                                <p>
                                                                ${getDescription(e)}
                                                                </p>
                                                            </section>
                                                            <footer class="modal-card-foot">
                                                                <button class="button" onclick = "deleteEvent('${e.id}')">Delete Event</button>
                                                            </footer>
                                                        
                                                        </div>
                                                    </div>
                                                </div>
                                        </div>`;
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
function toggleModal(evId) {
    document.getElementById(`${evId}`).classList.toggle('is-active');

}
function getDescription(event){
    let str = ``;
    if(event.description!= null){
        str+=event.description;
    }
    return `${str}`;
}
function deleteEvent(evId){
    console.log(`${evId}`);
    
    return gapi.client.calendar.events.delete({
        'calendarId': 'primary',
        'eventId': `${evId}`
    })
        .then(function(response) {
                // Handle the results here (response.result has the parsed body).
                toggleModal(`${evId}`);
                location.reload();
              },
              function(err) { console.error("Execute error", err); });

}

function tagCol(evColorId){
     let tagColour ='';
    if (evColorId == 4) {
            tagColour = 'is-danger'
       
            } else if (evColorId == 5) {
                tagColour = 'is-warning'
               
            } else {
                tagColour = 'is-success'
                
            }
            return `${tagColour}`;
}
