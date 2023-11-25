const multer = require('multer');
const sharp = require('sharp');
const path= require('path');

// MIME_TYPES : Definition de la nature et du format dun objet
const MIME_TYPES = {
    'image/jpg': 'webp',
    'image/jpeg': 'webp',
    'image/png': 'webp'
  };


  const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, 'images');
    },
    filename: async (req, file, callback) => {

      const name = file.originalname.split(' ').join('_');  // On separe les mots apres les espaces et on reconstitue en joingnant les mots par un _ 
      const extension = MIME_TYPES[file.mimetype];
      const newName = (path.parse(name).name) + Date.now() + '.' + extension;

      callback(null, newName);

      console.log('\n\n-----------------------------------------------------------')
      console.log('file : ', file)
      console.log('file.buffer : ', file.buffer)
      console.log('newName : ', newName)
      console.log('chemin complet du fichier : ', 'images/' + newName  )
      console.log('-----------------------------------------------------------\n\n')

      // await sharp(file.buffer)
      // .webp({quality:20})
      // .toFile('images/' + newName)
      // const link = `http://localhost:4000/images/${newName}`;




      // const upload = multer({ storage: storage }).single('image');

      // module.exports = (req, res, next) => {
      //     upload(req, res, async (err) => {
      //         if (err) {
      //             return res.status(400).json({ error: err.message });
      //         }
      
      //         const newName = req.file.filename;
      
      //         await sharp(req.file.path)
      //             .webp({ quality: 20 })
      //             .toFile('images/' + newName);
      
      //         const link = `http://localhost:4000/images/${newName}`;
      
      //         res.json({ link });
      //     });
      // };


      
    }
  });
module.exports = multer({storage: storage}).single('image');