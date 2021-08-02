let googleUser, googleUserId, data;

window.onload = () => {
// When page loads, check user logged in state
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            console.log("LoggedIn")
            googleUserId = user.uid;
            googleUser = user;
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