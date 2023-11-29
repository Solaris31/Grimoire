const sharp = require('sharp');


sharp(fileName)
.resize(null, 456)
.toFile('images/' + fileName)
.then( () => { console.log('Image correctement reduite') })
.catch( error => { console.error(error) })

