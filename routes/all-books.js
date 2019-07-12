const express = require("express");
const router = express.Router();
const Books = require("../models").Book;
const Op = require("sequelize").Op; // this lets you use queries with findAndCountAll using WHERE + key-value pairs

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

// GET and POST routers for the /books/:id route. UPDATE

router.get("/:id", (req, res, next) => {
    const { id } = req.params;
    Books.findByPk(id)
      .then(data => res.render("update-book", { books: data.dataValues }))
      .catch(err => next(err));
  });
  
  router.post("/:id", (req, res, next) => {
    const { id } = req.params;
    const { body } = req;
    Books.findByPk(id)
      .then(book => book.update(body)) // updates entry using the body variable
      .then(book => res.redirect("/books/" + id))
      .catch(err => {
        if (err.name === "SequelizeValidationError") {
          body.id = id;
          res.render("update-book", {
            books: body,
            errors: err.errors
          });
        } else {
          throw err;
        }
      })
      .catch(err => next(err));
  });
  
// GET and POST routers for the /books/:id/delete route. DELETE

router.get("/:id/delete", (req, res, next) => {
    const { id } = req.params;
    Books.findByPk(id)
      .then(data => res.render("delete", data.dataValues))
      .catch(err => next(err));
  });
  
  router.post("/:id/delete", (req, res, next) => {
    const { id } = req.params;
    Books.findByPk(id)
      .then(book => book.destroy())
      .then(() => res.redirect("/books/"))
      .catch(err => next(err));
  });

//   ----- SEARCH FUNCTIONS -----

// functions that returns an array based on rowCount and offset input

const createPageArray = (rowCount, offset) => {
    let pageLinks = [];
    let pagination = 1;
  
    for (let i = 0; i < parseInt(rowCount); i += offset) {
      pageLinks.push(pagination);
      pagination += 1;
    }
  
    return pageLinks;
  };
  
  // Book list based on search and page.
  
  router.get("/", (req, res, next) => {
    let { page } = req.query;
    let { search } = req.query;
    const pagesLimit = 10; // if you want to change the amount of results per page, do it here
  
    if (!page) {
      page = 0;
    }
  
    if (!search) {
      search = "";
    }
  
    Books.findAndCountAll({
      offset: parseInt(page) * pagesLimit,
      limit: pagesLimit,
      where: {
        [Op.or]: [
          { title: { [Op.substring]: search } },
          { author: { [Op.substring]: search } },
          { genre: { [Op.substring]: search } },
          { year: { [Op.substring]: parseInt(search) } }
        ]
      }
    })
      .then(response => {
        const pageLinks = createPageArray(response.count, pagesLimit);
        res.render("index", {
          books: response.rows,
          linkArray: pageLinks,
          page: page,
          searchString: search
        });
      })
      .catch(err => next(err));
  });
  
  module.exports = router;