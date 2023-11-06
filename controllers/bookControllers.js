// Importation du modele book
const Book = require('../models/Book');

// Package fs pour la suppression dun fichier
const fs = require('fs');


// -6- CREATION dun nouveau livre -----------------------------------------------------------
exports.CreateBook = (req, res, next) => {

    const bookToSave = new Book({
        ...req.body,
        userId : req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });


    bookToSave.save()
    .then( () => {
        res.status(200).json({message : 'Creation dun nouveau livre'})  // Creation dun livre
    })
    .catch(error => {res.status(402).json({error})})  // Erreur de requette a la BD
};



// -3- RECUPERATION de tous les livres de la BD ---------------------------------------------
exports.FindAllBook = (req, res, next) => {
    
    Book.find()
    .then( ArrayOfBook => {
        res.status(200).json(ArrayOfBook);
    })
    .catch(error => res.status(404).json({error}));  // Liste de livres non trouvée
};



// -4- RECUPERATION dun livre en fonction de l'Id du livre fourni en parametre ---------------
exports.FindOneBook = (req, res, next) => {

    Book.findOne( {_id : req.params.id} )
    .then( oneBook => { 
        res.status(200).json(oneBook);
    })
    .catch(error => res.status(400).json(error))  // Livre non trouvé
};



// -7- UPDATE dun livre trouvé grace a son ID du livre fourni en parametre -------------------
exports.UpdateBook = ( req, res, next) => {

    Book.findOne({_id : req.body._id})
    .then( () => {
        if(req.file) {  // remplacement de limage
            req.body.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
        }

        Book.updateOne({_id : req.params.id}, {...req.body, _id : req.params.id})
        .then( () => {
            res.status(200).json('Livre mis a jour');
        })
        .catch(error => res.status(400).json({error}));  // Erreur dacces au livre
    })
    .catch(error => { res.status(500).json({error})});  // Erreur dacces a la BD
    };



// -8- DELETE Suppression dun livre selon l'ID passé en parametre ------------------------------
exports.DeleteBook = (req, res, next) => {

    Book.findOne({ _id: req.params.id})
    .then( bookToDelete => {
        if (bookToDelete.userId != req.auth.userId) {
            res.status(401).json({message : 'Droits insuffisants pour la suppression'});
        } else {
            const filename = bookToDelete.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                bookToDelete.deleteOne({_id : req.params.id})
                .then( () => {res.status(200).json({message : 'Livre supprimé'})})
                .catch(error => res.status(401).json({error}));
            })
        }
    })
    .catch(error => res.status(500).json(error));
};



// -9- Notation dun livre (1-5)
exports.NotationBook = (req, res, next) => {
    
};