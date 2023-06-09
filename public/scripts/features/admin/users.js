import { db } from "../../firebase/firebase.js";
import { formatUser } from "./search-admin.js";
import { onSnapshot,
    query,
    collection,
    orderBy, limit,
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

const recentUsersContainer = document.querySelector("#most-recent-user-pins");

export async function displayRecentUsers() {
    const colRef = collection(db, 'users');
    const colQuery = await query(colRef,
        orderBy('timeCreated'),
        limit(10, 'desc')
    );

    onSnapshot(colQuery, (querySnapshot) => {
        recentUsersContainer.innerHTML = "";
        querySnapshot.forEach((doc) => {
            const formatted = formatUser(doc.data(), doc.ref);
            recentUsersContainer.appendChild(formatted);
        });
    });
}