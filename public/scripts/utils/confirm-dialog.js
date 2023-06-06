import { hideProcessDialog } from "./process-dialog.js";
import { toastMessage } from "./toast-message.js";

const confirmDialogModal = document.querySelector("#confirm-dialog-modal");
const yesButton = confirmDialogModal.querySelector("#yes-button");
const noButton = confirmDialogModal.querySelector("#no-button");
const dialogText = confirmDialogModal.querySelector("#confirm-dialog-text");

const closeConfirmButton = confirmDialogModal.querySelector("#confirm-dialog-close-button");

export async function displayConfirmDialog(process, message, toastText) {
    setDialogState(true, message);
    
    const yesHandler = async () => {
        setDialogState(false, null);
        await process()
        .then(() => {
            if (toastText) toastMessage(toastText);
        })
        .catch((error) => {
            console.log(error)
            toastMessage("Something went wrong, try again.");
        })
        .finally(() => {
            hideProcessDialog();
            removeEventListeners(yesHandler, clearConfirmEvent);
        });
    }

    const clearConfirmEvent = () => {
        removeEventListeners(yesHandler, clearConfirmEvent);
        confirmDialogModal.classList.remove("active");
    };

    bindEventListeners(yesHandler, clearConfirmEvent);
}

function setDialogState(visible, message) {
    dialogText.textContent = message;
    visible ? confirmDialogModal.classList.add("active") : confirmDialogModal.classList.remove("active");
}

function bindEventListeners(processRef, clearEventsRef) {
    yesButton.addEventListener('click', processRef);
    closeConfirmButton.addEventListener('click', clearEventsRef);
    noButton.addEventListener('click', clearEventsRef);
}

function removeEventListeners(processRef, clearEventsRef) {
    yesButton.removeEventListener('click', processRef);
    noButton.removeEventListener('click', clearEventsRef);
    closeConfirmButton.removeEventListener('click', clearEventsRef);
}