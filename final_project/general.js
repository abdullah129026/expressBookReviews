// Client for the Book Review shop API (runs against the local server on port 5000).
// Retrieves all books and book details based on ISBN, author, and title,
// using Axios with promise callbacks and async/await.
// Every function: fetches via axios.get, logs/returns the result on success,
// and reports errors — including an explicit not-found message on HTTP 404.
const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

// Shared error handling: a 404 from the API means "not found", anything else
// is reported as a fetch error.
function handleError(error, what) {
  if (error.response && error.response.status === 404) {
    console.log('Not found: no book matches ' + what + ' (server returned 404)');
  } else {
    console.error('Error fetching ' + what + ':', error.message);
  }
}

// Task 11: Get all books — using async/await with Axios
async function getAllBooks() {
  try {
    const response = await axios.get(BASE_URL + '/');
    console.log('All books:');
    console.log(response.data);
    return response.data;
  } catch (error) {
    handleError(error, 'all books');
  }
}

// Task 12: Get book details based on ISBN — using promise callbacks with Axios
function getBookByISBN(isbn) {
  return axios.get(BASE_URL + '/isbn/' + isbn)
    .then((response) => {
      console.log('Book with ISBN ' + isbn + ':');
      console.log(response.data);
      return response.data;
    })
    .catch((error) => {
      handleError(error, 'book with ISBN ' + isbn);
    });
}

// Task 13: Get book details based on author — using promise callbacks with Axios
function getBooksByAuthor(author) {
  return axios.get(BASE_URL + '/author/' + encodeURIComponent(author))
    .then((response) => {
      console.log('Books by author ' + author + ':');
      console.log(response.data);
      return response.data;
    })
    .catch((error) => {
      handleError(error, 'books by author ' + author);
    });
}

// Task 14: Get book details based on title — using async/await with Axios
async function getBooksByTitle(title) {
  try {
    const response = await axios.get(BASE_URL + '/title/' + encodeURIComponent(title));
    console.log('Books with title ' + title + ':');
    console.log(response.data);
    return response.data;
  } catch (error) {
    handleError(error, 'books with title ' + title);
  }
}

// Demo run: exercise all four retrieval methods, plus not-found cases
async function main() {
  await getAllBooks();
  await getBookByISBN(1);
  await getBooksByAuthor('Chinua Achebe');
  await getBooksByTitle('Things Fall Apart');
  await getBookByISBN(999);       // not-found case: server replies 404
  await getBooksByAuthor('Nobody Here'); // not-found case: server replies 404
}

if (require.main === module) {
  main();
}

module.exports = { getAllBooks, getBookByISBN, getBooksByAuthor, getBooksByTitle };
