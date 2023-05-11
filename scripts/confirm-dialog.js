const confirmDialogModal = document.getElementById("confirm-dialog-modal");
const yesButton = confirmDialogModal.querySelector("#yes-button");
const noButton = confirmDialogModal.querySelector("#no-button");
const textConfirmation = confirmDialogModal.querySelector("#confirm-dialog-text");

const closeConfirmButton = confirmDialogModal.querySelector("#confirm-dialog-close-button");

bindEvents();

function bindEvents() {
    closeConfirmButton.addEventListener('click', () => {
        yesButton.removeEventListener('click', yesButtonHandler);
        confirmDialogModal.classList.remove("active");
    });

    noButton.addEventListener('click', () => {
        yesButton.removeEventListener('click', yesButtonHandler);
        confirmDialogModal.classList.remove("active");
    });    
}

async function yesButtonHandler(process, message) {
    await process();
    confirmDialogModal.classList.remove("active");
    yesButton.removeEventListener('click', yesButtonHandler);
}

export async function displayConfirmDialog(process, message) {
    textConfirmation.textContent = message;
    confirmDialogModal.classList.add("active");
    yesButton.addEventListener('click', async () => {yesButtonHandler(process, message);});
}