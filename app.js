// Recuperation de la couche express
const express = require('express');

// Creation de lapplication de type express
const app = express();

// Recuperation de la couche mongoose
const mongoose = require('mongoose');

// Recuperation des Schema definis
const book= require('./models/Book');
const user= require('./models/User');

app.use(express.json());

// connexion a MongoDB
mongoose.connect('mongodb+srv://joseluisgarcia31000:xgVD41iqBjZgrfW3@cluster0.icdbzs9.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// Permissions daccess entre 2 machines differentes
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });



app.post('/api/auth/signup', function (req, res, next) {

  console.log(req.body);
  res.status(201).json({ message: req.body.email})
  next();
});

// app.use((req, res) => {
//     res.json({message:"Requete recue"});
// });


// Exportation du module
module.exports = app;