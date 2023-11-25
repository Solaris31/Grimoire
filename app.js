// Recuperation de la couche express
const express = require('express');
// Creation de lapplication de type express
const app = express();
// Recuperation de la couche mongoose
const mongoose = require('mongoose');
// Recuperation des Schema definis
const Book= require('./models/Book');
// Middleware de prise en charge des données json dans lapplication express
app.use(express.json());

// const bodyParser = require("body-Parser");


// Definition de la route (path) de notre server
const path = require('path');

// Importation des routes
const routerUser = require('./routes/routesUser');
const routerBook = require('./routes/routesBook');
const bodyParser = require('body-parser');


// connexion a MongoDB
mongoose.connect(process.env.DB,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


  // CORS : Permissions daccess entre 2 machines differentes
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });


// Mappage des diverses routes pour les utilisateurs
app.use('/api/auth', routerUser );

// Mappage des diverses routes pour les livres
app.use('/api/books', routerBook );
app.use('/images', express.static(path.join(__dirname, 'images')));

// Eclatement des données transmisent sous forme de chaine de caracteres
app.use(bodyParser.json());

// Exportation du module
module.exports = app;