import { getQueryOneField } from "../firestore-api.js";

const openLogIn = document.getElementById("log-in-modal-button");
const openSignUp = document.getElementById("sign-up-modal-button");
const homeButton = document.getElementById("home");
const displayName = document.getElementById("display-name-index");

auth.onAuthStateChanged(async (user) => {
    if (user) {
        openLogIn.style.display = "none";
        openSignUp.style.display = "none";
        homeButton.style.display = "flex";
        displayName.style.display = "flex";
        const querySnapshot = await getQueryOneField('users', 'email', user.email);
        const currentUserData = querySnapshot.docs[0].data();
        if (currentUserData.newUser) {
            displayName.textContent = currentUserData.email;
        } else {
            displayName.textContent = currentUserData.displayName;
        }
    }
});

homeButton.addEventListener('click', () => window.location.href = "./home.html");