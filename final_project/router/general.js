const express = require('express');
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
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
// public_users.get('/',function (req, res) {
//     return res.send(JSON.stringify(books,null,4));
// });;


// Promise - get the book list available in the shop
public_users.get('/',function (req, res) {
    return new Promise((resolve, reject) => {
        let data = res.send("books: " + JSON.stringify(books,null,4));
        resolve(data);
    })
});

// // Get book details based on ISBN
// public_users.get('/isbn/:isbn',function (req, res) {
//     let isbn = req.params.isbn;
//     let booksNumber = Object.keys(books).length;
//     if(isbn < 1 || isbn > booksNumber) {
//       return res.send(`ISBN not found, enter a number from 1 to ${booksNumber}`);
//     }
//     else {
//       return res.send(books[isbn]);
//     }
//    });

// Promise - get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    let myPromise = new Promise((resolve, reject) => {
        try {
            let isbn = req.params.isbn;
            let info = books[isbn];
            resolve(info);
        } catch(err) {
            reject(err);
        }
    })
    myPromise.then(
        (info) => res.send(info),
        (err) => res.send(err)
    )
   });

// // Get book details based on author
// public_users.get('/author/:author',function (req, res) {
//   let author = req.params.author;
//   let authors = [];
//   booksNumber = Object.keys(books).length;
  
//   for(let i = 1; i < booksNumber; i++) {
//     if(books[i]['author'] === author) {
//         authors.push(books[i]);
//     }
//   }
//   if(!authors.length) {
//     return res.send("Author not found");
//   }
//   else {
//     return res.send(authors);
//   }
// });


// Promise - get book details based on author
public_users.get('/author/:author',function (req, res) {
    let myPromise = new Promise((resolve, reject) => {
        let author = req.params.author;
        let authors = [];
        booksNumber = Object.keys(books).length;
        
        try {
            for(let i = 1; i < booksNumber; i++) {
                if(books[i]['author'] === author) {
                authors.push(books[i]);
                }
            }
            resolve(authors);
        } catch(err) {
            reject(err);
        }
    })
    myPromise.then(
        (authors) => res.send("booksbyauthor: " + JSON.stringify(authors,null,4)),
        (err) => res.send(err)
    );
  });

// // Get all books based on title
// public_users.get('/title/:title',function (req, res) {
//     let title = req.params.title;
//     let titles = [];
//     booksNumber = Object.keys(books).length;
    
//     for(let i = 1; i < booksNumber; i++) {
//       if(books[i]['title'] === title) {
//           titles.push(books[i]);
//       }
//     }
//     if(!titles.length) {
//       return res.send("Title not found");
//     }
//     else {
//       return res.send(titles);
//     }
// });


// Promise - get all books based on title
public_users.get('/title/:title',function (req, res) {
    let myPromise = new Promise((resolve, reject) => {
        try {
            let title = req.params.title;
            let titles = [];
            booksNumber = Object.keys(books).length;
    
            for(let i = 1; i < booksNumber; i++) {
                if(books[i]['title'] === title) {
                    titles.push(books[i]);
                }
            }
            resolve(titles);
        } catch (err) {
            reject(err);
        }
    })
    myPromise.then(
        (titles) => res.send("booksbytitle: " + JSON.stringify(titles,null,4)),
        (err) => res.send(err)
    )
});



//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    let booksNumber = Object.keys(books).length;
    if(isbn < 1 || isbn > booksNumber) {
      return res.send(`ISBN not found, enter a number from 1 to ${booksNumber}`);
    }
    else {
      return res.send(books[isbn]['reviews']);
    }
});

module.exports.general = public_users;
