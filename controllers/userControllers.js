const User = require('../models/User');

// Recuperation de la couche de hachage
const bcrypt= require('bcrypt');



// SIGNUP : creation dun nouvel utilisateur dans la BD ----------------------------------------------
exports.CreateUser = (req, res) => {

  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      delete req.body._id;

      const newUser = new User({
        email: (req.body.email).toLowerCase(),  // Affectation de lemail en version minuscule
        password: hash                          // Affectation du MDP fourni en parametre puis haché
      });

      newUser.save()
        .then( () => res.status(201).json({message : 'Utilisateur enregistré'}))
        .catch(error => res.status(400).json({error}));
    })
    .catch(error => res.status(500).json({error}));
};



// LOGIN : connexion utilisateur connu dans la BD -----------------------------------------------------
exports.AuthentifyUser = (req, res) => {
  
  console.log(req.body.email);

  User.findOne({email: req.body.email})
    .then( userBD => {
      if (!userBD) { res.status(404).json({error})}                            // Email inconnu

      else {
        bcrypt.compare( User.password, req.body.password )
          .then( result => {
            if (!result) {res.status(405).json({error})}                       // MPD errone
            else {res.status(202).json({message : 'Utilisateur authentifié'})} // MDP correct
          })
          .catch( error => res.status(403).json({error}));                     // Comparaison erronee
      }
    })
    .catch( error => res.status(501).json({ error : 'appel a la BD errone'})); // Erreur de connexion a la BD
};