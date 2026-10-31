// Client for the Book Review shop API (runs against the local server on port 5000).
// Retrieves all books and book details based on ISBN, author, and title,
// using Axios with promise callbacks and async/await.
const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

// Task 11: Get all books — using async/await with Axios
async function getAllBooks() {
  try {
    const response = await axios.get(BASE_URL + '/');
    console.log('All books:');
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching all books:', error.message);
  }
}

// Task 12: Get book details based on ISBN — using promise callbacks with Axios
function getBookByISBN(isbn) {
  axios.get(BASE_URL + '/isbn/' + isbn)
    .then((response) => {
      console.log('Book with ISBN ' + isbn + ':');
      console.log(response.data);
      return response.data;
    })
    .catch((error) => {
      console.error('Error fetching book by ISBN:', error.message);
    });
}

// Task 13: Get book details based on author — using promise callbacks with Axios
function getBooksByAuthor(author) {
  axios.get(BASE_URL + '/author/' + encodeURIComponent(author))
    .then((response) => {
      console.log('Books by author ' + author + ':');
      console.log(response.data);
      return response.data;
    })
    .catch((error) => {
      console.error('Error fetching books by author:', error.message);
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
    console.error('Error fetching books by title:', error.message);
  }
}

// Demo run: exercise all four retrieval methods
async function main() {
  await getAllBooks();
  getBookByISBN(1);
  getBooksByAuthor('Chinua Achebe');
  await getBooksByTitle('Things Fall Apart');
}

if (require.main === module) {
  main();
}

module.exports = { getAllBooks, getBookByISBN, getBooksByAuthor, getBooksByTitle };
