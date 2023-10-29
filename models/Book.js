const mongoose = require('mongoose');


// Caracteristiques dun livre
const bookSchema = mongoose.Schema({
    userId: { type:String},
    title : {type: String},
    author: {type: String},
    imageUrl: {type: String},
    year: {type: Number},
    genre: {type: String},
    ratings: [{
         userId: {type: String},
         grade: {type: Number},
    }],
    averageRating: {type: Number},
});

module.exports = mongoose.model('Book', bookSchema);