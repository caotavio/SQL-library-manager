const express = require("express");
const router = express.Router();
const Books = require("../models").Book;

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

// Renders the new-book template

router.get("/", (req, res) => {
  res.render("new-book", {books: ""});
});

//Creates new books

router.post("/", (req, res) => {
  const { body } = req;
  Books.create(body)
    .then(() => res.redirect("/books/"))
    .catch(err => {
      if (err.name === "SequelizeValidationError") {
        res.render("new-book", {
          books: body,
          errors: err.errors
        });
      } else {
        throw err;
      }
    })
    .catch(() => res.send(500));
});

module.exports = router;