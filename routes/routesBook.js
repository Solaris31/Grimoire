// Importation des dépendances
const express = require('express');
const router = express.Router();


const auth = require('../middleware/auth')             // Middleware "auth" pour lauthentification par JsonWebToken
const multer = require('../middleware/multer-config')  // Middleware "multer" pour la gestion de telechargement de fichier en MultiPart/form


const bookControllers= require('../controllers/bookControllers');


//Routes des books
router.post('/:id/rating', auth, bookControllers.NotationBook);

router.post('/', auth, multer, bookControllers.CreateBook);

router.put('/:id', auth, multer, bookControllers.UpdateBook);

router.get('/bestrating', auth, bookControllers.FindBestRating);

router.get('/', auth, bookControllers.FindAllBook);

router.get('/:id', auth, bookControllers.FindOneBook);

router.delete('/:id', auth, bookControllers.DeleteBook);


// Exportation du module
module.exports = router;