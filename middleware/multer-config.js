const multer = require('multer');
const path= require('path');
const sharp = require('sharp');


// MIME_TYPES : RE-definition du format dun objet
const MIME_TYPES = {
    'image/jpg': 'webp',
    'image/jpeg': 'webp',
    'image/png': 'webp'
};


const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');  // On separe les mots apres les espaces et on reconstitue en joingnant les mots par un _ 
    const extension = MIME_TYPES[file.mimetype];
    const fileName = ((path.parse(name).name) + Date.now() + '.' + extension);

    console.log('fileName : ', fileName)


    sharp(`images/${fileName}`)
      .resize(null, 456)
      .toFile('images/' + `${fileName}`, (error, info) => {
        if (error) { console.error(error) }
        else { console.log('Limage a etee correctement reduire') }

        callback(null, fileName);
      })
  }
});
module.exports = multer({storage: storage}).single('image');