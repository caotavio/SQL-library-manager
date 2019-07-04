'use strict';
module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define('Book', {
    // validation to ensure the title and author values are not empty
    title: {
      type: DataTypes.STRING,
      validate: { notEmpty: { msg: "Please enter a book title." } } 
    },
    author: {
      type: DataTypes.STRING,
      validate: { notEmpty: { msg: "Please enter an author name." } }
    },
    genre: DataTypes.STRING,
    year: DataTypes.INTEGER
  }, {});
  Book.associate = function(models) {
    // associations can be defined here
  };
  return Book;
};