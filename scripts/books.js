export function formatBook(book) {
    const pin = document.createElement("div");
    const title = document.createElement("label");
    const author = document.createElement("label");
    const genre = document.createElement("label");
    
    pin.classList.add("pin");
    pin.classList.add("small");

    title.textContent = "Title: " + book.title;
    author.textContent = "Author: " + book.author;
    genre.textContent = "Genre/s: " + book.genre;

    pin.appendChild(title);
    pin.appendChild(author);
    pin.appendChild(genre);
    return pin;
}

export async function fetchAllBooks() {
    try {
        const querySnapshot = await db
        .collection('books')
        .get();

        const books = querySnapshot.docs;
        return books;
    } catch (error) {
        console.log(error)
    }
}