import { db } from "../../firebase/firebase.js";
import { onSnapshot,
    query,
    collection,
    orderBy, startAt, endAt
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import { updateQuery } from "../../firebase/firestore-api.js";

import { formatRequest, formatReturnRequest } from "./requests.js";
import { isIdValid } from "../../utils/validation.js";
import { displayProcessDialog } from "../../utils/process-dialog.js";
import { displayConfirmDialog } from "../../utils/confirm-dialog.js";
import { toastMessage } from "../../utils/toast-message.js";

const searchCard = document.querySelector("#search-admin");
const searchResultContainer = searchCard.querySelector("#search-result-admin");
const searchInput = searchCard.querySelector("#search-input-admin");
const searchWhere = searchCard.querySelector("#where-filter-admin");

const editUserModal = document.querySelector("#edit-user-modal");
const overlay = document.querySelector("#fourth-overlay");

const editUserForm = editUserModal.querySelector("#edit-user-form");
const userId = editUserForm.querySelector("#edit-user-id");
const userRole = editUserForm.querySelector("#edit-user-role");
const closeEditUSer = editUserModal.querySelector("#close-edit-user-modal");

const saveUserChanges = editUserForm.querySelector("#save-user-changes");

export function bindAdminSearchEvents() {
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === "Enter" && searchInput.value !== '') {
            searchFor(searchInput.value.trim(), searchWhere.textContent);
        }
    });
}

export function formatUser(user, userRef) {
    const container = document.createElement("div");

    const name = document.createElement("label");
    const email = document.createElement("label");
    const gender = document.createElement("label");
    const id = document.createElement("label");
    const courseYear = document.createElement("label");

    const wrapper = document.createElement("div");
    const editButton = document.createElement("button");

    container.classList.add("pin");
    container.classList.add("medium");
    container.classList.add("nh");

    name.classList.add("title");
    name.textContent = `${user.firstName} ${user.middleName} ${user.lastName}`;

    email.classList.add("other-details");
    email.textContent = user.email;

    gender.classList.add("other-details");
    gender.textContent = `${user.sex}`;

    id.classList.add("other-details");
    id.textContent = `${user.id}`;

    courseYear.classList.add("other-details");
    courseYear.textContent = `${user.course}, ${user.year} year`;

    const process = async () => {
        editUserModal.classList.add("active");
        overlay.classList.add("active");
        userId.value = user.id;
        userRole.textContent = user.isAdmin? "Admin" : "User";

        const saveProcess = async function(e) {
            e.preventDefault();
            if (/^\d{2}-\d{5}$/.test(userId.value)) {
                const process = async () => {
                    displayProcessDialog("Proccessing...");
                    updateUser(userRef);
                    overlay.classList.remove("active");
                    editUserModal.classList.remove("active");
                }
                const confirmMessage = "Save the changes you made?";
                const toastText = "User updated.";
                displayConfirmDialog(process, confirmMessage, toastText);
            } else {
                toastMessage("Invalid ID format.");
            }
        }
        saveUserChanges.addEventListener('click', saveProcess);

        const closeEvent = async () => {
            hideEditUSerModal(saveProcess, closeEvent);
        }
        closeEditUSer.addEventListener('click', closeEvent);
        overlay.addEventListener('click', closeEvent);
    }

    wrapper.classList.add("wrapper");
    editButton.classList.add("yellow");
    editButton.textContent = "Edit";

    editButton.addEventListener('click', process);

    wrapper.appendChild(editButton);

    container.appendChild(name);
    container.appendChild(gender);
    container.appendChild(id);
    container.appendChild(courseYear);
    container.appendChild(wrapper);

    return container;
}

function hideEditUSerModal(eventRef, closeRef) {
    const process = async () => {
        overlay.classList.remove("active");
        editUserModal.classList.remove("active");
        editUserForm.reset();
        saveUserChanges.removeEventListener('click', eventRef);
        closeEditUSer.removeEventListener('click', closeRef);
        overlay.removeEventListener('click', closeRef);
    }
    const confirmMessage = "The changes you made will be lost. Continue?";
    displayConfirmDialog(process, confirmMessage, null);
} 

async function updateUser(userRef) {
    const isAdmin = userRole.textContent === "Admin" ? true : false;
    const changes = {
        id: userId.value, 
        isAdmin: isAdmin
    };
    updateQuery(userRef, changes);
}

export function formatReturnedTransactionAdmin(transaction) {
    const container = document.createElement("div");

    const title = document.createElement("label");
    const isbn = document.createElement("label");
    const status = document.createElement("label");
    const by = document.createElement("label");
    const date = document.createElement("label");

    container.classList.add("pin");
    container.classList.add("large");

    title.classList.add("title");
    title.textContent = transaction.bookTitle;

    isbn.classList.add("other-details");
    isbn.textContent = transaction.bookIsbn;

    by.classList.add("other-details");
    by.textContent = transaction.requestedBy;

    status.classList.add("other-details");
    status.textContent = `Status: ${transaction.status}`;

    date.classList.add("time");
    date.textContent = transaction.status === "Approved" ? 
        `Return by: ${transaction.returnDue}` :
        `Date returned: ${transaction.dateReturned}`;

    container.appendChild(title);
    container.appendChild(isbn);
    container.appendChild(by);
    container.appendChild(status);
    container.appendChild(date);

    return container;
}

async function searchFor(input, col) {
    if (col === "Transactions") { searchTransanctions(input, col); return }
    if (col === "Requests") { searchRequests(input, col); return }
    if (col === "Users") { searchUsers(input, col); }
}

async function searchUsers(input, col) {
    const colRef = collection(db, col.toLowerCase());
    const colQuery = await query(colRef,
        orderBy('id'),
        startAt(input),
        endAt(input  + "\uf8ff")
    );

    onSnapshot(colQuery, (querySnapshot) => {
        searchResultContainer.innerHTML = "";
        querySnapshot.forEach((doc) => {
            const formatted = formatUser(doc.data(), doc.ref);
            searchResultContainer.appendChild(formatted);
        });
    });
}

async function searchRequests(input, col) {
    const colRef = collection(db, col.toLowerCase());
    const colQuery = await query(colRef,
        orderBy('requestedBy'),
        startAt(input),
        endAt(input  + "\uf8ff")
    );
    
    const secondColQuery = await query(colRef,
        orderBy('returnedBy'),
        startAt(input),
        endAt(input  + "\uf8ff") 
    );

    onSnapshot(colQuery, (querySnapshot) => {
        searchResultContainer.innerHTML = "";
        querySnapshot.forEach((doc) => {
            const formatted = formatRequest(doc.data(), doc.ref);
            searchResultContainer.appendChild(formatted);
        });
    });

    onSnapshot(secondColQuery, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const secondFormatted = formatReturnRequest(doc.data(), doc.ref);
            searchResultContainer.appendChild(secondFormatted);
        });
    });
}

async function searchTransanctions(input, col) {
    const colRef = collection(db, col.toLowerCase());
    const colQuery = await query(colRef,
        orderBy('requestedBy'),
        startAt(input),
        endAt(input  + "\uf8ff")
    );

    onSnapshot(colQuery, (querySnapshot) => {
        searchResultContainer.innerHTML = "";
        querySnapshot.forEach((doc) => {
            const formatted = formatReturnedTransactionAdmin(doc.data());
            searchResultContainer.appendChild(formatted);
        });
    });
}