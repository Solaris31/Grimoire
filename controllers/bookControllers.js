// Importation du modele book
const Book = require('../models/Book');


// Package fs pour la gestion dun fichier
const fs = require('fs');


// -3- Affichage de tous les livres de la BD sous forme dun tableau --------------------------
exports.FindAllBook = (req, res, next) => {
    
    Book.find()
    .then( arrayOfBook => { res.status(200).json(arrayOfBook) })
    .catch( error => res.status(500).json({error}));               // Erreur daccees a la BD
};


// -4- Affichage dun livre en fonction de l'Id du livre fourni en parametre ------------------
exports.FindOneBook = (req, res, next) => {

    Book.findOne({ _id : req.params.id })
    .then( oneBook => {
        if(!oneBook) { res.status(404).json('Livre non trouvé') }
        else { res.status(200).json(oneBook) }
    })
    .catch( error => res.status(500).json({error}))  // Erreur daccees a la BD
};


// -5- Affichage dun tableau composé des 3 meilleures notation de livre ----------------------
exports.FindBestRating = (req, res, next) => {

    Book.find().sort({ "averageRating" : -1 }).limit(3)
    
    .then( arrayOf3Book => {
        if( arrayOf3Book.length > 0 ) { res.status(200).json(arrayOf3Book) }
        else { res.status(404).json(arrayOf3Book)}
    })
    .catch( error => res.status(500).json({error}));  // Erreur dacces a la BD
};


// -6- Creation dun nouveau livre -----------------------------------------------------------
exports.CreateBook = (req, res, next) => {

    const {book} = req.body;
    const data = JSON.parse(book);

    const bookToSave = new Book({
        userId : req.auth.userId,
        title: data.title,
        author: data.author,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        year: data.year,
        genre: data.genre,
        averageRating: 0,
    });

    bookToSave.save()
    .then( book => {  // Creation dun livre
        if(!book) { res.status(404).json({error})}
        else { res.status(200).json({message : 'Creation dun nouveau livre'}) }
    })
    .catch(error => { res.status(500).json({error})})  // Erreur de requette a la BD
};


// -7- Update dun livre trouvé grace a son ID du livre fourni en parametre -------------------
exports.UpdateBook = ( req, res, next) => {


    Book.findOne({_id : req.params.id})
    .then( () => {

        if(req.file) {  // remplacement de limage
            req.body.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
        }

        Book.updateOne({_id : req.params.id},
            { $set: {_id : req.params.id, ...req.body } }
        )
        .then( () => {
            res.status(200).json('Livre mis a jour');
        })
        .catch(error => res.status(403).json({error}));  // Erreur dacces au livre
    })
    .catch(error => { res.status(500).json({error})});  // Erreur dacces a la BD
};


// -8- Delete dun livre selon l'ID passé en parametre ------------------------------------------
exports.DeleteBook = (req, res, next) => {

    Book.findOne({ _id: req.params.id})
    .then( bookToDelete => {
        const filename = bookToDelete.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
            bookToDelete.deleteOne({_id : req.params.id})
            .then( () => {res.status(200).json({message : 'Livre supprimé'})})
            .catch(error => res.status(403).json({error}));
        })
    })
    .catch(error => res.status(500).json(error));
};


// -9- Note un livre puis laffiche ----------------------------------------------------------------
exports.NotationBook = (req, res, next) => {

    if (req.body.rating <1 || req.body.rating >5) { return res.status(403).json('Erreur de note, la valeur doit etre comprise entre 1 et 5') }

    Book.findOne({ _id : req.params.id, "ratings.userId" : req.auth.userId })
    .then( bookFind => {
        if (bookFind) { return res.status(404).json('Livre deja noté par cet utilisateur')}
        else { return Book.updateOne({ _id : req.params.id },
            {
                $push: {
                    ratings : {
                        userId : req.auth.userId,
                        grade : req.body.rating
                    }
                }
            })
        }
    })
    // Creation du pipeline pour attribuer la moyenne au livre
    .then ( () => {
        return Book.aggregate([
            { $match: { $expr : { $eq: [ '$_id' , { $toObjectId: (req.params.id) }]}}},
            { $unwind:  "$ratings" },
            { $group: {
                "_id": "$_id",
                "avgGrade" : { $avg: "$ratings.grade" },
            }},
            { $addFields: {
                "roundAvg" : { $round : ["$avgGrade" , 1]}
            }}
        ])
    })
    .then (result => {  // MAJ de la notation moyenne du livre
        return Book.updateOne({ _id : req.params.id },
            {
                $set: {'averageRating' : result[0].roundAvg}
            }
        )
    })
    .then( () => {  // Affichage du livre MAJ
        return Book.findOne({ _id : req.params.id })
        .then ((bookNoted => { res.status(200).json( bookNoted )}))
    })
    .catch(error => res.status(500).json({error}))
}