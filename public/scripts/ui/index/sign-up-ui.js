const signUpModal = document.getElementById("sign-up-modal");
const haveAccountLabel = signUpModal.querySelector("#have-account");
const openSignUp = document.querySelector("#sign-up-modal-button");

bindEvents();

function bindEvents() {
    haveAccountLabel.addEventListener('click', (e) => {
        window.location.href = './sign-in.html';
    });
}