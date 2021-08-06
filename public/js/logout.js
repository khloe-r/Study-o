function logout() {
    console.log("Signing Out!")
    firebase.auth().signOut()
    gapi.auth2.getAuthInstance().signOut();
    window.location = 'index.html'
}