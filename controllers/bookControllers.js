// Importation du modele book
const Book = require('../models/Book');

const mongoose = require('mongoose');


// Package fs pour la gestion dun fichier
const fs = require('fs');



// -3- Affichage de tous les livres de la BD sous forme dun tableau --------------------------
exports.FindAllBook = (req, res, next) => {
    
    Book.find()
    .then( arrayOfBook => { res.status(200).json(arrayOfBook) })
    .catch( error => res.status(404).json({error}));  // tableau de livres non trouvé
}


// -4- Affichage dun livre en fonction de l'Id du livre fourni en parametre ------------------
exports.FindOneBook = (req, res, next) => {

    Book.findOne({ _id : req.params.id })
    .then( oneBook => { res.status(200).json(oneBook) })
    .catch( error => res.status(404).json({error}))  // Livre non trouvé
};


// -5- Affichage dun tableau composé des 3 meilleures notation de livre ----------------------
exports.FindBestRating = (req, res, next) => {

    Book.find().sort({ "averageRating" : -1 }).limit(3)
    
    .then( arrayOf3Book => {res.status(200).json(arrayOf3Book) })
    .catch( error => res.status(400).json({error}));
};


// -6- Creation dun nouveau livre -----------------------------------------------------------
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
    .catch(error => {res.status(404).json({error})})  // Erreur de requette a la BD
};


// -7- Update dun livre trouvé grace a son ID du livre fourni en parametre -------------------
exports.UpdateBook = ( req, res, next) => {

    Book.findOne({_id : req.params.id})
    .then( () => {
        if(req.file) {  // remplacement de limage
            req.body.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
        }

        Book.updateOne({_id : req.params.id}, {...req.body, _id : req.params.id})
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
        if (bookToDelete.userId != req.auth.userId) {
            res.status(401).json({message : 'Droits insuffisants pour la suppression du livre'});
        } 
        else {
            const filename = bookToDelete.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                bookToDelete.deleteOne({_id : req.params.id})
                .then( () => {res.status(200).json({message : 'Livre supprimé'})})
                .catch(error => res.status(403).json({error}));
            })
        }
    })
    .catch(error => res.status(500).json(error));
};


// -9- Note un livre puis laffiche ----------------------------------------------------------------
exports.NotationBook = (req, res, next) => {
    
    console.log("Req.params.id : ",req.params.id)

    try {
        if (req.body.rating <1 || req.body.rating >5)
            return res.status(403).json('Erreur de note, la valeur doit etre comprise entre 1 et 5')
        else {
            // Teste si lutilisateur a DEJA noté ce livre
            return Book.findOne({ _id : req.params.id, "ratings.userId" : req.body.userId })
            .then(findBook => {
                if(findBook) res.status(403).json("Le livre a deja ete noté par cet utilisateur")
                //  Cest un nouveau votant du livre, donc ajout dun champ userId et un rating
                else {
                    return Book.updateOne({ _id : req.params.id },
                        { $push: { ratings : { userId : req.body.userId, grade : req.body.grade }}}
                    )
                }
            })
            .catch (error => { res.status(407).json({error})})


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
            .catch (error => { res.status(422).json({error})} )
            
            .then ( result => {  // MAJ de la notation moyenne du livre
                console.log(result)

                return Book.updateOne({ _id : req.params.id },
                    { $set: { 'averageRating' : result[0].roundAvg }}
                )
            .catch(error => { res.status(482).json({error})})

            .then( () => {  // Affichage du livre MAJ
                return Book.findOne({ _id : req.params.id })
                .then ((bookNoted => { res.status(200).json({ bookNoted })}))
            })})
        }
    } catch (error) { res.status(500).json({error})}  // Erreur daccces a la base BD
};