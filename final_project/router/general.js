const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!isValid(username)) {
            users.push({"username":username,"password":password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        }
        return res.status(404).json({message: "User already exists!"});
    }
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).send(JSON.stringify(books[isbn], null, 4));
    }
    return res.status(404).json({message: `ISBN ${isbn} not found`});
 });

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    let booksbyauthor = [];
    for (let isbn in books) {
        if (books[isbn]['author'] === author) {
            booksbyauthor.push(books[isbn]);
        }
    }
    return res.status(200).send(JSON.stringify({booksbyauthor}, null, 4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    let booksbytitle = [];
    for (let isbn in books) {
        if (books[isbn]['title'] === title) {
            booksbytitle.push(books[isbn]);
        }
    }
    return res.status(200).send(JSON.stringify({booksbytitle}, null, 4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).send(JSON.stringify(books[isbn]['reviews'], null, 4));
    }
    return res.status(404).json({message: `ISBN ${isbn} not found`});
});

const baseURL = "http://localhost:5000";

// Task 11: Get all books using an async callback function
async function getAllBooks(callback) {
    try {
        const response = await axios.get(baseURL + "/");
        callback(null, response.data);
    } catch (error) {
        callback(error);
    }
}

// Task 12: Search by ISBN using Promises
function searchByISBN(isbn) {
    return axios.get(baseURL + "/isbn/" + isbn)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.error("Error fetching book by ISBN:", error.message);
            throw error;
        });
}

// Task 13: Search by Author using async/await
async function searchByAuthor(author) {
    try {
        const response = await axios.get(baseURL + "/author/" + author);
        return response.data;
    } catch (error) {
        console.error("Error fetching books by author:", error.message);
        throw error;
    }
}

// Task 14: Search by Title using async/await
async function searchByTitle(title) {
    try {
        const response = await axios.get(baseURL + "/title/" + title);
        return response.data;
    } catch (error) {
        console.error("Error fetching books by title:", error.message);
        throw error;
    }
}

module.exports.general = public_users;
module.exports.getAllBooks = getAllBooks;
module.exports.searchByISBN = searchByISBN;
module.exports.searchByAuthor = searchByAuthor;
module.exports.searchByTitle = searchByTitle;
