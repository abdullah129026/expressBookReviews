const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  // A username is valid (available) when no registered user has it yet
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  return userswithsamename.length === 0;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password);
  });
  return validusers.length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!authenticatedUser(username, password)) {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }

  // Generate JWT access token
  let accessToken = jwt.sign({
    data: password
  }, 'access', { expiresIn: 60 * 60 });

  req.session.authorization = {
    accessToken, username
  };
  return res.status(200).json({message: "User successfully logged in"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  // Review text: accepted as a query parameter (course convention) or in the body
  let review = req.query.review || req.body.review;
  let username = req.session.authorization.username;

  if (!books[isbn]) {
    return res.status(404).json({message: "Book not found"});
  }
  if (!review) {
    return res.status(404).json({message: "Review text not provided"});
  }

  // Add new review, or modify the existing review by this user
  books[isbn].reviews[username] = review;
  return res.status(200).json({message: "Review successfully added/modified", reviews: books[isbn].reviews});
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  let username = req.session.authorization.username;

  if (!books[isbn]) {
    return res.status(404).json({message: "Book not found"});
  }
  if (!books[isbn].reviews[username]) {
    return res.status(404).json({message: "No review by this user to delete"});
  }

  delete books[isbn].reviews[username];
  return res.status(200).json({message: "Review deleted successfully"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
