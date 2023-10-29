//Importation du modele book
const Book = require('../models/Book');

// -6- CREATE BOOK : Creation dun nouveau livre selon lié a son createur par l'id ------------------
exports.CreateBook = (req, res, next) => {

    const newBook = new Book({
            userId: '',
            title : req.body.title,
            author: '',
            imageUrl: req.body.imageUrl,
            year: 0,
            genre: '',
            ratings: [{
                userId: '',
                grade: 0,
            }],
            averageRating: 0
    });


    newBook.save()
    .then( () => {
        res.status(200).json({message : 'Creation dun nouveau livre'})  // Creation dun livre
    })
    .catch(error => {res.status(502).json({ error})})  // Erreur de requette a la BD
};



// -6- FIND ALL BOOK : Renvoie tous les livres de la BD -------------------------------------------
exports.FindAllBook = (req, res, next) => {
    
    Book.find()
    .then( ArrayOfBook => {
        res.status(200).json({ArrayOfBook})}
    )
    .catch(error => res.status(404).json({error}));
    }