import { auth } from "../firebase/firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";

import { saveQuery } from "../firebase/firestore-api.js";
import { toastMessage } from "../utils/toast-message.js";
import { currentDateTime } from "../utils/date.js";

const reportButton = document.querySelector("#report-button");

const reportModal = document.querySelector("#report-modal"); 
const closeReportmodal = reportModal.querySelector("#close-report-modal");

const reportForm = reportModal.querySelector("#report-form");
const reportTitle = reportForm.querySelector("#report-title");
const reportDetails = reportForm.querySelector("#report-details");

const sendButton = reportModal.querySelector("#send-report-button");

const overlay = document.querySelector("#overlay");

bindEvents();

function bindEvents() {
    reportButton.addEventListener('click', () => {
        overlay.classList.add("active");
        reportModal.classList.add("active");
    });

    closeReportmodal.addEventListener('click', () => {
        overlay.classList.remove("active");
        reportModal.classList.remove("active");
        reportForm.reset();
    });

    overlay.addEventListener('click', () => {
        overlay.classList.remove("active");
        reportModal.classList.remove("active");
        reportForm.reset();
    });

    sendButton.addEventListener('click', async () => {
        if (areInputsValid()) {
            onAuthStateChanged(auth, (user) => {
                saveReport(user.email);
            });
        }
    });
}

function areInputsValid() {
    if (!reportTitle.value.trim()) {
        toastMessage("Specify what the report is about, write the title.");
        return false;
    }
    if (!reportDetails.value.trim()) {
        toastMessage("Write the details.");
        return false;
    }

    return true;
}

async function saveReport(userEmail) {
    const docData = { 
        title: reportTitle.value.trim(),
        details: reportDetails.value.trim(),
        timeReported: currentDateTime(),
        reportedBy: userEmail
    }

    await saveQuery('reports', crypto.randomUUID(), docData);
    reportForm.reset();
    toastMessage("Report sent.");
} 