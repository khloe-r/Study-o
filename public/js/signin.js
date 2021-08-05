const signIn = () => {
    console.log("Calling sign in")
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope("https://www.googleapis.com/auth/calendar");


    firebase.auth()
        .signInWithPopup(provider)
        .then(result => {
            //do something
            console.log(`Result is: ${result}`)
            const credential = result.credential
            const token = credential.accessToken
            const user = result.user
            console.log(user.uid)
            window.location = 'dashboard.html'
        })
        .catch(error => {
            //something bad happens
            console.log(error)
        })
}

