function logout() {
    console.log("Signing Out!")
    firebase.auth().signOut()
    window.location = 'index.html'
}