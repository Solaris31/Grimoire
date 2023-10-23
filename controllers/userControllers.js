const User = require('../models/User');
const express = require('express');

// Recuperation de la couche de hachage
const bcrypt= require('bcrypt');



// Creation dun nouvel utilisateur dans la BD
exports.CreateUser = (req, res) => {

  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      delete req.body._id;

      const newUser = new User({
        email: (req.body.email).toLowerCase(),  // Affectation de lemail passé en parametre en version minuscule
        password: hash                          // Affectation du mdp fourni en parametre puis haché
      });

      newUser.save()
        .then( () => res.status(201).json({message : 'Utilisateur enregistré'}))
        .catch(error => res.status(400).json({error}));
    })
    .catch(error => res.status(500).json({error}));
};



// Connexion utilisateur connu dans la BD
exports.AuthentifyUser = (req, res) => {
  
  console.log(req.body);

  User.findOne({email : req.body.email})
    .then( userBD => {
      if (!userBD) { res.status(404).json({error})}  // Email inconnu

      else {
        userBD.compare(req.body.password)
          .then( () => {res.status(202).json({message : 'Utilisateur authentifié'})})
          .catch( error => res.status(403).json({error}));  // Mdp erroné
      }
    })
    .catch(error => res.status(501).json({error}));  // Erreur de connexion a la BD
};