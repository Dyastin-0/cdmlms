import { deleteQueryFromRef, saveQuery, updateQuery, getQueryTwoFields, getQueryOneField } from '../../firebase/firestore-api.js';
import { displayConfirmDialog } from '../../utils/confirm-dialog.js';
import { displayProcessDialog, hideProcessDialog } from '../../utils/process-dialog.js';
import { currentDateTimePlus, currentDateTime } from '../../utils/date.js';

export async function acceptRequest(requestObject, requestRef) {
    const transaction = {
        status: "Approved",
        bookTitle: requestObject.bookTitle,
        bookIsbn: requestObject.bookIsbn,
        requestedBy: requestObject.requestedBy,
        returnDue: currentDateTimePlus(2)
    }

    const process = async () => {
        displayProcessDialog("Saving transaction...");
        const bookSnapshot = await getQueryTwoFields('books',
            'title', 'isbn',  requestObject.bookTitle, requestObject.bookIsbn);
        const bookRef = bookSnapshot.docs[0].ref;
        await updateQuery(bookRef, {isAvailable: false});
        await saveQuery('transactions', crypto.randomUUID(), transaction);
        await deleteQueryFromRef(requestRef);
        hideProcessDialog();
    }
    const confirmMessage = "You are about to accept the book request. Continue?";
    const toastText = "Book request accepted.";
    displayConfirmDialog(process, confirmMessage, toastText);
}

export async function deleteRequest(requestRef) {
    const process = async () => {
        displayProcessDialog("Deleting request...");
        await deleteQueryFromRef(requestRef);
        hideProcessDialog();
    }

    const confirmMessage = "You are about to delete a request. Continue?";
    const toastText = "Request deleted.";
    displayConfirmDialog(process, confirmMessage, toastText);
}

export async function confirmReturnRequest(request, requestRef) {
    const process = async () => {
        displayProcessDialog("Confirming request...");
        console.log(request.bookIsbn)
        const bookSnapshot = await getQueryOneField('books', 'isbn', request.bookIsbn);
        const trasactionSnapshot = await getQueryOneField('transactions', 'bookIsbn', request.bookIsbn);
        const transactionRef = trasactionSnapshot.docs[0].ref;
        const bookRef = bookSnapshot.docs[0].ref;
        console.log(bookRef);
        await deleteQueryFromRef(requestRef);
        await updateQuery(bookRef, {isAvailable: true});
        await updateQuery(transactionRef, {dateReturned: currentDateTime(), status: "Resolved"});
        hideProcessDialog();
    };

    const confirmMessage = "You are about to accept the return request. Continue?";
    const toastText = "Book received.";
    displayConfirmDialog(process, confirmMessage, toastText);
}