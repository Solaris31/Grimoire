// Importation des dépendances
const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');


const bookControllers= require('../controllers/bookControllers');




//Routes des books
router.post('/', auth, multer, bookControllers.CreateBook);

router.put('/:id', auth, multer, bookControllers.UpdateBook);

router.get('/', auth, bookControllers.FindAllBook);

router.get('/:id', auth, bookControllers.FindOneBook);

router.delete('/:id', auth, bookControllers.DeleteBook);


// Exportation du module
module.exports = router;