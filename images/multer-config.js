const multer = require('multer');

// MIME_TYPES : Definition de la nature et du format dun objet
const MIME_TYPES = {
    'image/jpg' : 'jpg',
    'image/jpeg' : 'jpg',
    'image/png' : 'png'
}

const storage = multer.diskStorage({
    destination : (req, file, callback) => {
        callback(null, 'images')
    },
    filename : (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');  // Remplacement despace par des _ dans le nom des fichiers
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

module.exports = multer({storage}).single('images');