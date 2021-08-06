function handleClientLoad() {
    // Client ID and API key from the Developer Console
    var CLIENT_ID = '243003109957-8bpj74e6eib10r888ccleeh1t0lhqp8g.apps.googleusercontent.com';
    var API_KEY = 'AIzaSyDEL7uevoZ_rQ3JLHWDTqHGKrWvTRG-tKY';

    // Array of API discovery doc URLs for APIs used by the quickstart
    var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

    // Authorization scopes required by the API; multiple scopes can be
    // included, separated by spaces.
    var SCOPES = "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/documents";
    gapi.load('client:auth2', () => {
        gapi.client.init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            discoveryDocs: DISCOVERY_DOCS,
            scope: SCOPES
        }).then(function () {
            const auth2 = gapi.auth2.getAuthInstance()
            console.log("here3")
            console.log(auth2.isSignedIn);
            auth2.signOut();

            const bt = document.querySelector('#signInBtn');
            bt.onclick = function (event) {
                auth2.signIn();
                auth2.isSignedIn.listen(isSignedIn => {
                    console.log("here2")
                    if (isSignedIn) {
                        console.log("here")
                        const currentUser = auth2.currentUser.get()
                        const authResponse = currentUser.getAuthResponse(true)
                        console.log(authResponse);
                        const credential = firebase.auth.GoogleAuthProvider.credential(
                            authResponse.id_token,
                            authResponse.access_token
                        )
                        console.log("here");
                        firebase.auth().signInWithCredential(credential).then((result) => {
                            console.log(`Result is: ${result}`)
                            const credential = result.credential
                            const token = credential.accessToken
                            const user = result.user
                            console.log(user.uid)
                            window.location = 'dashboard.html'
                        }).catch((err) => {
                            console.log(err);
                        })
                    } else {
                        console.log("ahhajahkdjawhj")
                    }
                });
            }
        });
    });
}

const signIn = () => {
    console.log("Calling sign in")
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope("https://www.googleapis.com/auth/documents");
    provider.addScope("https://www.googleapis.com/auth/calendar");

    // firebase.auth()
    //     .signInWithPopup(provider)
    //     .then(result => {
    //         //do something
    //         console.log(`Result is: ${result}`)
    //         const credential = result.credential
    //         const token = credential.accessToken
    //         const user = result.user
    //         console.log(user.uid)
    //         window.location = 'dashboard.html'
    //     })
    //     .catch(error => {
    //         //something bad happens
    //         console.log(error)
    //     })
}

