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

// Definition de la route (path) de notre server
const path = require('path');

// Importation des routes
const routerUser = require('./routes/routesUser');
const routerBook = require('./routes/routesBook');


// connexion a MongoDB
mongoose.connect('mongodb+srv://joseluisgarcia31000:xgVD41iqBjZgrfW3@cluster0.icdbzs9.mongodb.net/?retryWrites=true&w=majority',
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

// Exportation du module
module.exports = app;