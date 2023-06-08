import { db } from "../../firebase/firebase.js";
import { onSnapshot,
    query,
    collection,
    limit, orderBy
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

import { deleteQueryFromRef, saveQuery, updateQuery, getQueryTwoFields, getQueryOneField } from '../../firebase/firestore-api.js';
import { displayConfirmDialog } from '../../utils/confirm-dialog.js';
import { displayProcessDialog } from '../../utils/process-dialog.js';
import { currentDateTimePlus, currentDateTime } from '../../utils/date.js';
import { toastMessage } from '../../utils/toast-message.js';
import { formatReturnedTransaction } from './search-admin.js';

const mostRecentContainer = document.querySelector("#most-recent-transactions");

export async function acceptRequest(requestObject, requestRef) {
    const transaction = {
        status: "Approved",
        bookTitle: requestObject.bookTitle,
        bookIsbn: requestObject.bookIsbn,
        requestedBy: requestObject.requestedBy,
        returnDue: currentDateTimePlus(2)
    }

    const bookSnapshot = await getQueryTwoFields('books',
    'title', 'isbn',  requestObject.bookTitle, requestObject.bookIsbn);
    const bookData = bookSnapshot.docs[0].data();
    if (!bookData.isAvailable) {
        toastMessage("The book is currently not available.");
        return;
    }

    const process = async () => {
        displayProcessDialog("Saving transaction...");
        const bookRef = bookSnapshot.docs[0].ref;
        await updateQuery(bookRef, {isAvailable: false});
        await saveQuery('transactions', crypto.randomUUID(), transaction);
        await deleteQueryFromRef(requestRef);
        
    }
    const confirmMessage = "You are about to accept the book request. Continue?";
    const toastText = "Book request accepted.";
    displayConfirmDialog(process, confirmMessage, toastText);
}

export async function deleteRequest(requestRef) {
    const process = async () => {
        displayProcessDialog("Deleting request...");
        await deleteQueryFromRef(requestRef);
    }

    const confirmMessage = "You are about to delete a request. Continue?";
    const toastText = "Request deleted.";
    displayConfirmDialog(process, confirmMessage, toastText);
}

export async function confirmReturnRequest(request, requestRef) {
    const process = async () => {
        displayProcessDialog("Proccessing...");
        const bookSnapshot = await getQueryOneField('books', 'isbn', request.bookIsbn);
        const trasactionSnapshot = await getQueryOneField('transactions', 'bookIsbn', request.bookIsbn);
        const bookRef = bookSnapshot.docs[0].ref;
        const transactionRef = trasactionSnapshot.docs[0].ref;
        await deleteQueryFromRef(requestRef);
        await updateQuery(bookRef, {isAvailable: true});
        await updateQuery(transactionRef, {dateReturned: currentDateTime(), status: "Resolved"});
        
    };

    const confirmMessage = "You are about to accept the return request. Continue?";
    const toastText = "Book received.";
    displayConfirmDialog(process, confirmMessage, toastText);
}

export async function displayMostRecentTransactions() {
    const colRef = collection(db, 'transactions');
    const colQuery = await query(colRef, 
           orderBy('dateReturned'),
           limit(10)
    );

    onSnapshot(colQuery, (querySnapshot) => {
        mostRecentContainer.innerHTML = "";
        console.log(querySnapshot.size)
        querySnapshot.forEach((doc) => {
            const formatted = formatReturnedTransaction(doc.data());
            mostRecentContainer.appendChild(formatted);
        });
    });
}