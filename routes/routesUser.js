// Importation des dépendances
const express = require('express');
const router = express.Router();
const UserControllers= require('../controllers/userControllers');


// Creation dun nouveau compte utilisateur
router.post('/signup', UserControllers.CreateUser);


// Exportation du module
module.exports = router;