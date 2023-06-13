import { db } from "../../firebase/firebase.js";
import { onSnapshot,
    query,
    collection,
    getCountFromServer, where
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

const pinContainer = document.querySelector("#statistic-pins");

const allUsers = pinContainer.querySelector("#total-users");
const pendingRequest = pinContainer.querySelector("#pending-requests");
const totalIssuedBook = pinContainer.querySelector("#total-issued-books");
const totalBooks = pinContainer.querySelector("#total-books");

export async function displayStatistics() {
    await getRealTimeDocumentCountWithFilterOf('users', allUsers, 'isNewUser', '==', false);
    await getRealTimeDocumentCountOf('requests', pendingRequest);
    await getRealTimeDocumentCountOf('transactions', totalIssuedBook);
    await getRealTimeDocumentCountOf('books', totalBooks);
}

async function getRealTimeDocumentCountWithFilterOf(col, element, filter, comparison, value) {
    const colRef = collection(db, col);
    const colQuery = query(colRef, 
        where(filter, comparison, value));

    onSnapshot(colQuery, (querySnapshot) => {
        element.textContent = querySnapshot.size > 0 ? querySnapshot.size : 0;
    });
}

async function getRealTimeDocumentCountOf(col, element) {
    const colRef = collection(db, col);
    const colQuery = query(colRef);

    onSnapshot(colQuery, (querySnapshot) => {
        element.textContent = querySnapshot.size > 0 ? querySnapshot.size : 0;
    });
}

async function getDocumentCountOf(col, element) {
    const colRef = collection(db, col);
    const snapshot = await getCountFromServer(colRef);
    element.textContent = snapshot.data().count > 0 ? snapshot.data().count : 0;
}