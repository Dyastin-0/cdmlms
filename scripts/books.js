function formatBook(book) {
    const pin = document.createElement("div");
}

export async function fetchAllBooks() {
    try {
        const querySnapshot = await db
        .collection('books')
        .get();

        const books = querySnapshot.docs;

        if(books) {
            return books; 
        }
        
        return null;
    } catch (error) {
        console.log(error)
    }
}

fetchAllBooks();