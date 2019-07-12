const express = require('express');
const sequelize = require("./models").sequelize;
const app = express();

const PORT = 3000; // if you need to change your port, do it here
const bodyParser = require("body-parser");

// view engine setup
app.set('view engine', 'pug');

// use body parser requests IF IT DOES NOT WORK COMMENT IT OUT
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/static", express.static("public"));
// app.use(require("express-favicon-short-circuit")); NEEDS TO BE INSTALLED IF USED

// Sets routes. GET and POST is dealt with in individual routes

app.get("/", (req, res) => res.redirect("/books/")); //redirects main route to books route
app.use("/books/new", require("./routes/new-book"));
app.use("/books", require("./routes/all-books"));

// Sets errors

app.use(function(req, res, next) {
  let err = new Error("Sorry! Page Not Found");
  err.status = 404;
  next(err);
  res.render("page-not-found");
});

app.use(function (err, req, res, next) {
  if (err.status === 404) {
      res.render('page-not-found');
  } else {
      res.render('error');
  }
});

// If database syncs, the server starts

sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () => console.log(`We are good to go! Now listening on port ${PORT}`));
  })
  .catch(err => console.error(`There seems to be a problem with the database: error: ${err}`));