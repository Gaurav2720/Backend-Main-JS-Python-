// PBL Activity: Implement a simple data management utility using Arrays and Objects

// Define an array named library
let library = [];

// Implement a function addBook(title, author) to add a book object to the array
function addBook(title, author) {
    const newBook = {
        title: title,
        author: author
    };
    library.push(newBook);
    console.log(`Added book: "${title}" by ${author}`);
}

// Implement a function findBook(title) to search for a book object by title
function findBook(title) {
    const book = library.find(b => b.title.toLowerCase() === title.toLowerCase());
    if (book) {
        console.log(`Found book: "${book.title}" by ${book.author}`);
        return book;
    } else {
        console.log(`Book titled "${title}" not found.`);
        return null;
    }
}

// Test these functions using Node.js
console.log("--- PBL Activity: Library Management ---");
addBook("The Great Gatsby", "F. Scott Fitzgerald");
addBook("1984", "George Orwell");
addBook("To Kill a Mockingbird", "Harper Lee");

console.log("\n--- Searching for books ---");
findBook("1984");
findBook("The Catcher in the Rye");
