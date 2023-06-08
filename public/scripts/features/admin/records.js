import { db } from "../../firebase/firebase.js";
import { collection,
    onSnapshot,
    query,
    orderBy, limit
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

import { formatReturnedTransactionAdmin } from "./search-admin.js";

const mostRecentContainer = document.querySelector("#most-recent-transactions");

export async function displayMostRecentTransactions() {
    const colRef = collection(db, 'transactions');
    const colQuery = await query(colRef, 
           orderBy('dateReturned'),
           limit(10)
    );

    onSnapshot(colQuery, (querySnapshot) => {
        mostRecentContainer.innerHTML = "";
        querySnapshot.forEach((doc) => {
            const formatted = formatReturnedTransactionAdmin(doc.data());
            mostRecentContainer.appendChild(formatted);
        });
    });
}