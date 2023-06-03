const signInModal = document.getElementById("sign-in-modal");
const closeSignIn = signInModal.querySelector("#sign-in-close-button");
const dontHaveAccountLabel = signInModal.querySelector("#dont-have-account");

bindEvents();

function bindEvents() {
    dontHaveAccountLabel.addEventListener('click', () => {
        window.location.href = './sign-up.html';
    });
}

