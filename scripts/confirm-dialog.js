import { toastMessage } from "./toast-message.js";

const confirmDialogModal = document.getElementById("confirm-dialog-modal");
const yesButton = confirmDialogModal.querySelector("#yes-button");
const noButton = confirmDialogModal.querySelector("#no-button");
const textConfirmation = confirmDialogModal.querySelector("#confirm-dialog-text");

const closeConfirmButton = confirmDialogModal.querySelector("#confirm-dialog-close-button");

export async function displayConfirmDialog(process, message, toastText) {
    textConfirmation.textContent = message;
    confirmDialogModal.classList.add("active");

    //process
    const yesHandler = async () => {
        document.body.style.cursor = "wait";
        await process();
        document.body.style.cursor = "default";
        if (toastText) toastMessage(toastText);
        confirmDialogModal.classList.remove("active");
        yesButton.removeEventListener('click', yesHandler);
    }

    //listeners
    yesButton.addEventListener('click', yesHandler);

    closeConfirmButton.addEventListener('click', () => {
        yesButton.removeEventListener('click', yesHandler);
        confirmDialogModal.classList.remove("active");
    });

    noButton.addEventListener('click', () => {
        yesButton.removeEventListener('click', yesHandler);
        confirmDialogModal.classList.remove("active");
    });    
}