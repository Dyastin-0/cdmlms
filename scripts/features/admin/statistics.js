import { db } from "../../firebase/firebase.js";
import { onSnapshot,
    query,
    collection
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

const pinContainer = document.querySelector("#statistic-pins");

const allUsers = pinContainer.querySelector("#total-users");
const pendingRequest = pinContainer.querySelector("#pending-requests");
const totalIssuedBook = pinContainer.querySelector("#total-issued-book");
const totalBooks = pinContainer.querySelector("#total-books");

export async function displayStatistics() {
    await getRealTimeDocumentCountOf('users', allUsers);
    await getRealTimeDocumentCountOf('books', totalBooks);
    await getRealTimeDocumentCountOf('requests', pendingRequest);
}

async function getRealTimeDocumentCountOf(col, element) {
    const colRef = collection(db, col);
    const colQuery = query(colRef);

    onSnapshot(colQuery, (querySnapshot) => {
        element.textContent = querySnapshot.size;
    });
}