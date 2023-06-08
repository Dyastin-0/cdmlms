import { db } from "../firebase/firebase.js";
import { onSnapshot,
    query,
    collection,
    where
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

import { deleteRequest } from "./admin/transaction.js";
import { getQueryTwoFields, saveQuery } from '../firebase/firestore-api.js';
import { displayConfirmDialog } from '../utils/confirm-dialog.js';
import { displayProcessDialog } from '../utils/process-dialog.js';
import { currentDateTime } from "../utils/date.js";
import { toastMessage } from "../utils/toast-message.js";

const transactionContainer = document.querySelector("#transaction-container");
const pendingContainer = document.querySelector("#pending-container");
const returnedContainer = document.querySelector("#returned-container");

export function formatTransaction(transaction, transactionRef) {
    const container = document.createElement("div");

    const title = document.createElement("label");
    const isbn = document.createElement("label");
    const dueReturn = document.createElement("label");
    const returnButton = document.createElement("button");

    container.classList.add("transaction");

    title.classList.add("title");
    title.textContent = transaction.bookTitle;
    isbn.textContent = transaction.bookIsbn;
    dueReturn.textContent = `Return before: ${transaction.returnDue}`;

    returnButton.textContent = "Return";
    returnButton.addEventListener('click', () => {
        returnBook(transaction, transactionRef);
    });

    container.appendChild(title);
    container.appendChild(isbn);
    container.appendChild(dueReturn);
    container.appendChild(returnButton);
    
    return container;
}

export function formatPendingRequest(request, requestRef) {
    const container = document.createElement("div");

    const title = document.createElement("label");
    const isbn = document.createElement("label");
    const timeRequested = document.createElement("label");
    const cancel = document.createElement("button");

    container.classList.add("transaction");

    title.classList.add("title");
    title.textContent = request.bookTitle;
    isbn.textContent = request.bookIsbn;
    timeRequested.textContent = `Time requested: ${request.timeRequested}`;

    cancel.textContent = "Cancel";
    cancel.classList.add("red");
    cancel.addEventListener('click', () => {
        deleteRequest(requestRef);
    });

    container.appendChild(title);
    container.appendChild(isbn);
    container.appendChild(timeRequested);
    container.appendChild(cancel);
    
    return container;
}

function formatReturnedTransaction(transaction) {
    const container = document.createElement("div");

    const title = document.createElement("label");
    const isbn = document.createElement("label");
    const status = document.createElement("label");
    const dateReturned = document.createElement("label");

    container.classList.add("transaction");

    title.classList.add("title");
    title.textContent = transaction.bookTitle;
    isbn.textContent = transaction.bookIsbn;
    status.textContent = `Status: ${transaction.status}`;
    dateReturned.textContent = `Date returned: ${transaction.dateReturned}`;

    container.appendChild(title);
    container.appendChild(isbn);
    container.appendChild(status);
    container.appendChild(dateReturned);
    
    return container;
}

async function returnBook(transaction) {
    const transacInfo = {
        type: "Return",
        bookTitle: transaction.bookTitle,
        bookIsbn: transaction.bookIsbn,
        returnedBy: transaction.requestedBy,
        timeRequested: currentDateTime()
    }
    const querySnapshot = await getQueryTwoFields('requests', 'bookIsbn', 'returnedBy',
        transaction.bookIsbn, transaction.requestedBy);
    if (!querySnapshot.empty) {
        toastMessage("You have already sent a return request for this book.");
        return;
    }
    const process = async () => {
        displayProcessDialog("Sending rending request...");
        await saveQuery('requests', crypto.randomUUID(),transacInfo);
    };

    const confirmMessage = `You are about to send a return request for ${transaction.bookTitle}. Continue?`;
    const toastText = "Book return request sent.";
    displayConfirmDialog(process, confirmMessage, toastText);
}

export async function renderPendingRequests(userId) {
    const colRef = collection(db, 'requests');
    const colQuery = await query(colRef,
        where('type', '==', 'Request'),
        where('requestedBy', '==', userId)    
    );

    onSnapshot(colQuery, (querySnapshot) => {
        pendingContainer.innerHTML = "";
        querySnapshot.forEach((doc) => {
            const formatted = formatPendingRequest(doc.data(), doc.ref);
            pendingContainer.appendChild(formatted);
        });
    });
}

export async function renderTransactions(userId) {
    const colRef = collection(db, 'transactions');
    const colQuery = query(colRef,
        where('requestedBy', '==', userId),
        where('status', '==', 'Approved')
    );

    onSnapshot(colQuery, (querySnapshot) => {
        transactionContainer.innerHTML = "";
        querySnapshot.forEach((doc) => {
            const formatted = formatTransaction(doc.data(), doc.ref);
            transactionContainer.appendChild(formatted);
        });
    });
}

export async function renderReturnedTransactions(userId) {
    const colRef = collection(db, 'transactions');
    const colQuery = query(colRef,
        where('requestedBy', '==', userId),
        where('status', '==', 'Resolved')
    );

    onSnapshot(colQuery, (querySnapshot) => {
        returnedContainer.innerHTML = "";
        querySnapshot.forEach((doc) => {
            const formatted = formatReturnedTransaction(doc.data(), doc.ref);
            returnedContainer.appendChild(formatted);
        });
    });
}