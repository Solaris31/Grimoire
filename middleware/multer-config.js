const multer = require('multer');
const path= require('path');
const sharp = require('sharp');
const fs = require('fs');
const { log } = require('console');


// MIME_TYPES : RE-definition du format dun objet
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
    'image/png': 'png'
};


const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');  // On separe les mots apres les espaces et on reconstitue en joingnant les mots par un _ 
    const extension = MIME_TYPES[file.mimetype];
    const fileName = `${path.parse(name).name}_${Date.now()}.` + extension;
    const outputFile = `${path.parse(name).name}`

    console.log("\n\n----------------------------------------")
    console.log("outputFile : ", outputFile)
    console.log("name : ", name)
    console.log("fileName : ", fileName)
    console.log("extension : ", extension)
    console.log("----------------------------------------\n\n")
    

    sharp(`images/${fileName}`)
      .resize(200, 200)
      .toFormat('webp')
      // .toFile('images/test.webp', (error, info) => {
      //   if(error) {
      //     callback(error);
      //   } else {
      //     console.log('Conversion reussie!')
      //   }
      // })
      // fs.unlinkSync(`images/${outputFile}` + '.extension')
    callback(null, fileName);
  }
})
module.exports = multer({storage: storage}).single('image');