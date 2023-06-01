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

async function getRealTimeDocumentCountOf(collection, element) {
    const query = await db
    .collection(collection);
    
    const count = query.onSnapshot((querySnapshot) => {
        element.textContent = querySnapshot.size;
    });
}