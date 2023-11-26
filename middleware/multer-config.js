const multer = require('multer');
const sharp = require('sharp');

// MIME_TYPES : RE-definition du format dun objet
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

  const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, 'images');
    },
    filename: (req, file, callback) => {
      const name = file.originalname.split(' ').join('_');  // On separe les mots apres les espaces et on reconstitue en joingnant les mots par un _ 
      const extension = MIME_TYPES[file.mimetype];
      callback(null, name + Date.now() + '.' + extension);
    }
  });
module.exports = multer({storage: storage}).single('image');