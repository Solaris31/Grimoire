// Importation des dépendances
const express = require('express');
const router = express.Router();
const userControllers= require('../controllers/userControllers');



// Creation dun nouveau compte utilisateur
router.post('/signup', userControllers.CreateUser);

// Connexion dun utilisateur connu dans la BD
router.post('/login', userControllers.AuthentifyUser);


// Exportation du module
module.exports = router;