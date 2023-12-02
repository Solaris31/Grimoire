//Importation du modele utilisisateur
const User = require('../models/User');

// Recuperation de la fonction de hachage
const bcrypt= require('bcrypt');

// Recupreration de la fonction des token
const jsonWebToken = require('jsonwebtoken');



// -1- SIGNUP Creation dun nouvel utilisateur dans la BD -------------------------------------------------
exports.CreateUser = (req, res, next) => {

  bcrypt.hash(req.body.password, 10)
  .then(hash => {
    delete req.body._id;

    const newUser = new User({
      email: (req.body.email),
      password: hash                                                            // Maj du MDP haché
    });

    newUser.save()
      .then( () => res.status(201).json({message : 'Utilisateur enregistré'}))  // Sauvegarde
      .catch(error => res.status(400).json({error}));                           // Erreur sauvegarde
  })
  .catch(error => res.status(508).json({error}));                               // Erreur de connexion a la BD
};




// -2- LOGIN connexion utilisateur connu dans la BD -------------------------------------------------------
exports.AuthentifyUser = (req, res, next) => {
 
  User.findOne({email: req.body.email})
  .then( userBD => {
    if (userBD === null) {
      res.status(401).json({message : 'Identifiants email ou MDP incorrects'})         //Email introuvable
    }
    else {
      bcrypt.compare( req.body.password , userBD.password )
      .then(result => {
        if (result) {res.status(200).json({                                            // MPD correct
          // _id : userBD._id,
          userId : userBD._id,
          token : jsonWebToken.sign(
            {userId: userBD._id},
            process.env.JWT_TOKEN,
            {expiresIn: '24h'})
        })}
        else {res.status(402).json({error : 'Identifiants email ou MDP incorrects'})}  // MDP incorrect
      })
      .catch(
    error => res.status(500).json({error})                                             // Erreur lors de la comparaison des MPD
  )}})
  .catch(error => {                                                                    // Erreur dechange avec la BD
    res.status(500).json({error})
  })
}