// Importation des dépendances
const express = require('express');
const router = express.Router();
const controllersUser= require('../controllers/userControllers');


// Creation dun nouveau compte utilisateur
router.post('/signup', controllersUser.CreateUser);


// Exportation du module
module.exports = router;