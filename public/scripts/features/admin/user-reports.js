import { db } from "../../firebase/firebase.js";
import { deleteQueryFromRef } from "../../firebase/firestore-api.js";
import { onSnapshot,
    query,
    collection,
    orderBy, limit
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import { toastMessage } from "../../utils/toast-message.js";
import { displayProcessDialog } from "../../utils/process-dialog.js";
import { displayConfirmDialog } from "../../utils/confirm-dialog.js";

const reportsContainer = document.querySelector("#user-report-pins");

export async function displayUserReports() {
    const colRef = collection(db, 'reports');
    const colQuery = query(colRef, 
        orderBy('timeReported'),
        limit(10)
    );

    onSnapshot(colRef, (querySnapshot) => {
        reportsContainer.innerHTML = "";
        querySnapshot.forEach((doc) => {
            const formatted = formatUserReport(doc.data(), doc.ref);
            reportsContainer.appendChild(formatted);
        });
    });
}

function formatUserReport(report, reportRef) {
    const pin = document.createElement("div");
    const title = document.createElement("label");
    const details = document.createElement("label");
    const by = document.createElement("label");
    const date = document.createElement("label");

    const wrapper = document.createElement("div");
    const deleteButton = document.createElement("button");

    pin.classList.add("pin");
    pin.classList.add("medium");
    pin.classList.add("nh");
    pin.classList.add("wl");

    title.classList.add("title");
    title.textContent = report.title;

    details.classList.add("other-details");
    details.textContent = report.details;

    by.classList.add("other-details");
    by.textContent = report.reportedBy;

    date.classList.add("other-details");
    date.textContent = report.timeReported;

    wrapper.classList.add("wrapper");
    deleteButton.classList.add("red");
    deleteButton.classList.add("fill");
    deleteButton.textContent = "Delete";
    wrapper.appendChild(deleteButton);

    deleteButton.addEventListener('click', () => {
        const process = async () => {
            displayProcessDialog("Deleting report...");
            deleteQueryFromRef(reportRef);
        }
        const confirmMessage = "You are about to delete a report. Continue?";
        const toastText = "Report deleted.";
        displayConfirmDialog(process, confirmMessage, toastText);
    });

    pin.appendChild(title);
    pin.appendChild(details);
    pin.appendChild(by);
    pin.appendChild(date);
    pin.appendChild(wrapper);
    return pin;
}