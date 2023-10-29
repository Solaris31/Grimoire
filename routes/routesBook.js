// Importation des dépendances
const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();
const bookControllers= require('../controllers/bookControllers');


router.post('/', auth, bookControllers.CreateBook);
router.get('/', auth, bookControllers.FindAllBook);


// Exportation du module
module.exports = router;