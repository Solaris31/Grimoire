const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs')

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
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    const fileName = `${path.parse(name).name}_${Date.now()}.${extension}`;
    callback(null, fileName);
  }
})


const imageReduction = (req, res, next) => {
  if(!req.file) {
    console.log('Pas de fichier a compresser'); return next();
  }

  const outputPath = `./images/imgCompressed/` + `${path.parse(req.file.filename).name}` + '.webp'

  sharp(req.file.path)
  .resize(200, 200)
  .toFormat('webp')
  .webp({quality:80})
  .toFile(outputPath, (error) => {
    if(error) {console.error(error)}
  })
  next();
}

module.exports = {upload: multer({ storage: storage }).single('image'), imageReduction};