// Importation des dépendances
const express = require('express');
const router = express.Router();
const bookControllers= require('../controllers/bookControllers');


router.post('/', bookControllers.CreateBook);


// Exportation du module
module.exports = router;