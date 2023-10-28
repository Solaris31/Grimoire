//Importation du modele book
const Book = require('../models/Book');



exports.CreateBook = (req, res , next) => {
    console.log(req)
    res.status(525).json("ca va");

};