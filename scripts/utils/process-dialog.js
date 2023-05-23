const processDialogModal = document.querySelector("#process-dialog-modal");

const processMessage = processDialogModal.querySelector("#process-message");

export function displayProcessDialog(message) {
    processDialogModal.classList.add("active");
    processMessage.textContent = message;
}

export function hideProcessDialog() {
    processDialogModal.classList.remove("active");
    processMessage.textContent = "";
}