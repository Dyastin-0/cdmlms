const toastMessageModal = document.querySelector("#toast-message-modal");
const toastText = toastMessageModal.querySelector("#toast-message");
const toastButton = toastMessageModal.querySelector("#toast-button");

bindEvents();

function bindEvents() {
    toastButton.addEventListener('click', () => {
        toastMessageModal.classList.remove("active");
        toastText.textContent = null;
    });
}

export function toastMessage(message) {
    toastMessageModal.classList.add("active");
    toastText.textContent = message;
    setTimeout(() =>{
        toastMessageModal.classList.remove("active");
    }, 3000);
}