const sharp = require('sharp');
const path = require('path');
const fs = require('fs')

module.exports = (req, res, next) => {

    const outputFile = `images/${path.parse(req.file.filename).name}` + '.webp'

    console.log("\n\nentree : ", `images/${req.file.filename}`)
    console.log("sortie : ", outputFile)
    console.log("\n\n")

    sharp(`images/${req.file.filename}`)
        .resize(200, 200)
        .toFormat('webp')
        .toFile(outputFile, (error, info) => {
            if (error) {
                console.error(error);
                return res.status(500).json('Erreur lors du traitement de l\'image');
            } 
            else { console.log(info);
                setTimeout(() => {
                    res.json({outputFile})
                    fs.unlinkSync(`images/${req.file.filename}`)
                }, 1000);
            }
        })
}