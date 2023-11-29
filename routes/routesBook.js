// Importation des dépendances
const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth')             // Middleware "auth" pour lauthentification par JsonWebToken
const multer = require('../middleware/multer-config')  // Middleware "multer" pour la gestion de telechargement de fichier en MultiPart/form
const bookControllers= require('../controllers/bookControllers');



// -9- Notation du livre
router.post('/:id/rating', auth, bookControllers.NotationBook);

// -6- Creation dun livre
router.post('/', auth, multer, bookControllers.CreateBook);

// -7- Maj dun livre
router.put('/:id', auth, multer, bookControllers.UpdateBook);

// -5- Affiche les 3 Meilleurs livres
router.get('/bestrating', bookControllers.FindBestRating);

// -3- Affiche tous les livres de la BD
router.get('/', bookControllers.FindAllBook);      

// -4- Affiche un livre
router.get('/:id', bookControllers.FindOneBook);

// -8- Supprime un livre
router.delete('/:id', auth, bookControllers.DeleteBook);


// Exportation du module
module.exports = router;